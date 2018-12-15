declare module 'geofire' {
    import firebase from 'firebase'
    namespace GeoFire {
      type Dictionary<T> = { [key:string]: T }
      type Latitude = number
      type Longitude = number
      type Ref = firebase.database.Reference
      type Location = [Latitude, Longitude] 
      type CenterCriteria = {center:Location}
      type RadiusCriteria = {radius: number}
      type QueryCriteria = CenterCriteria & RadiusCriteria
      type CriteriaUpdate = CenterCriteria | RadiusCriteria
      type KeyEventType = "key_entered" | "key_exited" | "key_moved"
      type ReadyEventType = "ready"
      type KeyEventCallback = (key:string, location:Location|null, distance:number|null)=>void
      type ReadyEventCallback = ()=>void
  
    }
    export interface GeoQuery {
      center(): GeoFire.Location
      radius(): number
      updateCriteria(newCriteria: GeoFire.CriteriaUpdate): void
  
      /**
       * @param eventType key_entered fires when a key enters this query. This can happen when a key moves from a location outside of this query to one inside of it or when a key is written to GeoFire for the first time and it falls within this query.
       * @param eventType key_exited fires when a key moves from a location inside of this query to one outside of it. If the key was entirely removed from GeoFire, both the location and distance passed to the callback will be null.
       * @param eventType key_moved fires when a key which is already in this query moves to another location inside of it.
       * @returns GeoCallbackRegistration
       */
      on(
        eventType:GeoFire.KeyEventType, 
        callback: GeoFire.KeyEventCallback
        ):GeoCallbackRegistration
      on(
        eventType:GeoFire.ReadyEventType, 
        callback:GeoFire.ReadyEventCallback
        ):GeoCallbackRegistration
      
      
  
      cancel():void
    }
    export interface GeoCallbackRegistration {
      cancel():void
    }
    class GeoFire {
      constructor(ref:GeoFire.Ref);
      ref():GeoFire
      get(key:string):Promise<GeoFire.Location>
      set(key:string, location:GeoFire.Location): Promise<null>
      set(locations:GeoFire.Dictionary<GeoFire.Location>): Promise<null>
      remove(key:string):Promise<null>
      query(criteria: GeoFire.QueryCriteria):GeoQuery
      
      static distance(location1:GeoFire.Location, location2:GeoFire.Location):number
    }
    export default GeoFire
  }