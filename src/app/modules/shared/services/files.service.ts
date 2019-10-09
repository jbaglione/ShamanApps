import { Plugins, Filesystem, FilesystemDirectory, CameraResultType, Camera, Capacitor, FilesystemEncoding } from '@capacitor/core';
import { MatTableDataSource } from '@angular/material';
import { CommonService } from '@app/modules/shared/services/common.service';
import { ExportMatTableToXlxs } from '../helpers/export-mat-table-to-xlxs';
import { Injectable } from '@Angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DateHelper } from '../helpers/DateHelper';

@Injectable()
export class FileService {

  static EXCEL_TYPE: FileType = { contentType: 'application/vnd.ms-excel', extension: '.xls', replace: 'data:application/vnd.ms-excel;base64,' };
  static EXCEL_NEW_TYPE: FileType = { contentType: 'application/vnd.ms-excel', extension: '.xlsx', replace: 'data:application/vnd.ms-excel;base64,' };
  static PDF_TYPE: FileType = { contentType: 'application/pdf', extension: '.pdf', replace: 'data:application/pdf;base64,' };
  isMobile: boolean;

  constructor(private commonService: CommonService,
              private deviceService: DeviceDetectorService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

  public exportMatTable(exportable: ExportMatTableToXlxs, mtDataSource: MatTableDataSource<any>, filename: string, share = false) {
    const arrayExport = exportable.arrayBaseToExcel(
      mtDataSource.sortData(mtDataSource.filteredData, mtDataSource.sort)
    );
    if (!arrayExport || arrayExport.length === 0) {
      const accion = share ? 'compartir' : 'guardar';
      this.commonService.showSnackBar('¡No hay registros para ' + accion + '!');
      return;
    }
    this.exportExcel(arrayExport, filename, share);
  }

  private exportExcel(json: any[], filename: string, share: boolean): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    if (share) {
      this.shareBuffer(excelBuffer, filename, FileService.EXCEL_NEW_TYPE);
    } else {
      this.saveBuffer(excelBuffer, filename, FileService.EXCEL_NEW_TYPE);
    }
  }

  public shareBuffer(buffer: any, filename: string, fileType: FileType): void {
    const fullFilename = filename + '_' + DateHelper.getFormattedTime() + fileType.extension;
    const blob: Blob = new Blob([buffer], { type: fileType.contentType });
    this.shareBlob(blob, fullFilename, fileType);
  }

  public shareBlob(blob: Blob, fullFilename: string, fileType: FileType): void {

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      Plugins.FileSharer.share({
        filename: fullFilename,
        base64Data: reader.result.toString().replace(fileType.replace, ''),
        contentType: fileType.contentType,
      }).then(() => {
        // do sth
      }).catch(error => {
        throw error;
      });
    };
  }

  public saveBuffer(buffer: any, filename: string, fileType: FileType): void {
    const fullFilename = filename + '_' + DateHelper.getFormattedTime() + fileType.extension;
    const data: Blob = new Blob([buffer], { type: fileType.contentType });

    if (this.isMobile) {
      this.saveBlobMobileNew(data, fullFilename, fileType);
      // this.shareBlob(data, fullFilename, fileType);
    } else {
      FileSaver.saveAs(data, fullFilename);
    }
  }

  public saveBlobMobile(blob: Blob, fullFilename: string): void {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const result = reader.result as string;
      try {
        Filesystem.writeFile({
          path: fullFilename,
          data: result,
          directory: FilesystemDirectory.Documents
        }).then(() => {
          Filesystem.getUri({
            directory: FilesystemDirectory.Documents,
            path: fullFilename
          }).then(() => {
            this.commonService.showSnackBar(fullFilename + ' guardado');
          }, (error) => {
            this.commonService.showSnackBar('Error, no se pudo guardar el archivo');
          });
        });
      } catch (error) {
        this.commonService.showSnackBar('Error, no se pudo guardar el archivo');
      }
    };
  }

  public saveBlobMobileNew(blob: Blob, fullFilename: string, fileType: FileType): void {
    try {
      this.readAsBinaryString(blob).then((result) => {
        this.fileWrite(result, fullFilename, fileType);
      });
      this.commonService.showSnackBar(fullFilename + ' guardado');
    } catch (error) {
      this.commonService.showSnackBar('Error, no se pudo guardar el archivo');
    }
  }

  fileWrite(dataString: string, fullFilename: string, fileType: FileType) {
    Plugins.Filesystem.writeFile({
      path: fullFilename,
      data: dataString.replace(fileType.replace, ''),
      directory: FilesystemDirectory.Documents
    });
  }

  readAsBinaryString(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = (event) => {
        resolve(reader.result as string);
      };
      reader.onerror = (event) => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }

  public async takePhotoAsync() {
    const options = {
      resultType: CameraResultType.Uri
    };

    const originalPhoto = await Camera.getPhoto(options);
    const photoInTempStorage = await Filesystem.readFile({ path: originalPhoto.path });

    const date = new Date(),
      time = date.getTime(),
      filename = time + '.jpeg';

    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: filename,
      directory: FilesystemDirectory.Data
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: filename
    });

    const photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    console.log(photoPath);
  }

  public takePhoto() {
    const options = {
      resultType: CameraResultType.Uri
    };
    Camera.getPhoto(options).then(
      photo => {
        Filesystem.readFile({
          path: photo.path
        }).then(
          result => {
            const date = new Date(),
              time = date.getTime(),
              filename = time + '.jpeg';
            Filesystem.writeFile({
              data: result.data,
              path: filename,
              directory: FilesystemDirectory.Data
            }).then(
              () => {
                Filesystem.getUri({
                  directory: FilesystemDirectory.Data,
                  path: filename
                }).then(
                  newResult => {
                    const path = Capacitor.convertFileSrc(newResult.uri);
                    console.log(path);
                  },
                  err => {
                    console.log(err);
                  }
                );
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }
}

export interface FileType {
  contentType: string;
  replace: string;
  extension: string;
}

// original takePhoto: https://www.joshmorony.com/using-the-capacitor-filesystem-api-to-store-photos/
//   takePhoto() {
//     const options = {
//       resultType: CameraResultType.Uri
//     };
//     Camera.getPhoto(options).then(
//       photo => {
//         Filesystem.readFile({
//           path: photo.path
//         }).then(
//           result => {
//             let date = new Date(),
//               time = date.getTime(),
//               fileName = time + ".jpeg";
//             Filesystem.writeFile({
//               data: result.data,
//               path: fileName,
//               directory: FilesystemDirectory.Data
//             }).then(
//               () => {
//                 Filesystem.getUri({
//                   directory: FilesystemDirectory.Data,
//                   path: fileName
//                 }).then(
//                   result => {
//                     let path = Capacitor.convertFileSrc(result.uri);
//                     console.log(path);
//                   },
//                   err => {
//                     console.log(err);
//                   }
//                 );
//               },
//               err => {
//                 console.log(err);
//               }
//             );
//           },
//           err => {
//             console.log(err);
//           }
//         );
//       },
//       err => {
//         console.log(err);
//       }
//     );
// }

  /// NOTA: Add plugin fileshare in Android Studio. MainActivity

  // import android.os.Bundle;
  // import com.byteowls.capacitor.filesharer.FileSharerPlugin;
  // import com.getcapacitor.BridgeActivity;
  // import com.getcapacitor.Plugin;

  // import java.util.ArrayList;
  // import java.util.List;

  // public class MainActivity extends BridgeActivity {
  //   @Override
  //   public void onCreate(Bundle savedInstanceState) {
  //     super.onCreate(savedInstanceState);

  //     List<Class<? extends Plugin>> additionalPlugins = new ArrayList<>();
  //     // Additional plugins you've installed go here
  //     // Ex: additionalPlugins.add(TotallyAwesomePlugin.class);
  //     additionalPlugins.add(FileSharerPlugin.class);

  //     // Initializes the Bridge
  //     this.init(savedInstanceState, additionalPlugins);
  //   }
  // }
