import { CommonService } from '@app/services/common.service';
import { forkJoin } from 'rxjs';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';

export class DownloadHelper {
  static downloadAllInZip(allFilesUrl: string[], filename: string, commonService: CommonService) {
    forkJoin(commonService.createGetRequets(allFilesUrl)).subscribe(res => {
      const zip = new JSZip();
      let fileName: String;

      res.forEach((f, i) => {
        if (allFilesUrl[i].includes('\\')) {
          fileName = allFilesUrl[i].substring(allFilesUrl[i].lastIndexOf('\\') + 1);
        } else {
          fileName = allFilesUrl[i].substring(allFilesUrl[i].lastIndexOf('/') + 1);
        }
          zip.file(`${fileName}`, f);
      });

      zip
        .generateAsync({ type: 'blob' })
        .then(blob => saveAs(blob, filename));
    });
  }
}
