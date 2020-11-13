import { Component, OnInit, ElementRef, NgZone, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PreIncidentesClientesService } from '../preincidentes-clientes.service';
import { DireccionFormateada } from '../models/DireccionFormateada';
import { CommonService } from '@app/modules/shared/services/common.service';

@Component({
  selector: 'app-google-map-custom',
  templateUrl: './google-map-custom.component.html',
  styleUrls: ['./google-map-custom.component.css']
})

export class GoogleMapsCustomComponent implements AfterViewInit {

  direccionFinal: DireccionFormateada;

  title = 'AGM project';
  markerPosition: google.maps.LatLngLiteral;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  dirDelFormSt: string;


  constructor(
    public dialogRef: MatDialogRef<GoogleMapsCustomComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DireccionFormateada,
    private ngZone: NgZone,
    private preincidentesClientesService: PreIncidentesClientesService,
    private commonService: CommonService
  ) { }

  ngAfterViewInit() {

    this.geoCoder = new google.maps.Geocoder;
      if (this.dialogData.longitud && this.dialogData.latitud) {
        this.markerPosition = { lat: this.dialogData.latitud, lng: this.dialogData.longitud };
          this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
          this.zoom = 16;
      } else if (this.dialogData.calle && this.dialogData.altura && this.dialogData.localidad ) { // && this.dialogData.provincia
        let direccion = this.dialogData.calle + ' ' + this.dialogData.altura + ', '
        + this.dialogData.localidad.descripcion + (this.dialogData.provincia ? ', ' + this.dialogData.provincia : ', Buenos Aires');
        this.searchElementRef.nativeElement.value = direccion;
      } else {
        this.setCurrentLocation();
      }

    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['address']
    });
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        // get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        // verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }
        // set latitude, longitude and zoom
        this.markerPosition = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
        this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
        this.zoom = 16;
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.markerPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.zoom = 12;
        this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
      });
    }
  }

  handleClick(event: google.maps.MouseEvent) {
    this.markerPosition = event.latLng.toJSON();
    this.getAddress(this.markerPosition.lat, this.markerPosition.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 16;
          this.address = results[0].formatted_address;
        } else {
          this.commonService.showSnackBar('No se encontraron resultados');
        }
      } else {
        this.commonService.showSnackBarFatal('Geocoder falló debido a: ' + status);
      }
    });
  }

  // Custom
  onNoClick(): void {
    this.dialogRef.close('close');
  }

  saveLocation() {
    // if (!this.markerDragEnd) {
    //     this.commonService.showSnackBar('Debe seleccionar un punto en el mapa');
    //     return;
    // }

    let ref = {
        lat: this.markerPosition.lat,
        lng:  this.markerPosition.lng,
        address: this.address,
        title: 'title'
    };
    // return ref.lat + ref.lng + ref.address + ref.title;
    this.dirDelFormSt = ref.lat + '$' + ref.lng + '$' + ref.address + '$' + ref.title;
    const that = this;
    this.preincidentesClientesService.FormatearFecha(this.dirDelFormSt).subscribe(direccionFinal => {
      this.direccionFinal = direccionFinal;
      this.direccionFinal.latitud = that.markerPosition.lat;
      this.direccionFinal.longitud = that.markerPosition.lng;
      this.dialogRef.close(this.direccionFinal);
    });
}

}
