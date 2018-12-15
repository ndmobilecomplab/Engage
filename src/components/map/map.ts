import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { GoogleMaps, GoogleMap, ILatLng, Marker } from '@ionic-native/google-maps';

/**
 * A component that allows for visualization of a single location on a map
 */
@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {
  
  /**
   * A reference to the Google Map in this element
   */
  map: GoogleMap;

  /**
   * The marker which marks the passed in location - as a promise for chained then() calls
   */
  marker: Promise<Marker>;

  /**
   * Reference to the div that will contain the map
   */
  @ViewChild('map') map_div: ElementRef;

  /**
   * Method allowing for parent components to pass in a location
   * 
   * Also initializes the map if it had not already been done
   */
  @Input()
  set location(location: ILatLng){
    if(!this.map) this.loadMap();

    this.map.setCameraTarget(location);
    
    if(!this.marker){
      this.map.setCameraZoom(15);
      this.marker = this.map.addMarker({
        position: location
      });
    } else {
      this.marker.then((marker) => { marker.setPosition(location); return marker; });
    }
  }

  /**
   * Initializes the map after the component is done being initialized
   */
  AfterViewInit(){
    this.loadMap();
  }

  /**
   * Sets up the map using the map_div
   */
  loadMap() {
    if(!this.map_div) return;
    this.map = GoogleMaps.create(this.map_div.nativeElement, {
      camera: {
        zoom: 15,
        tilt: 30
      }
    });
    //need to init?
  }
}
