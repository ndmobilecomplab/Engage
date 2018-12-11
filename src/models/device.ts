/**
 * Model representing a device, as would be shown on the main map
 */
export default class Device {
    
    /**
     * The name of the device
     */
    public name: string;
    
    /**
     * The key of the owning organization
     */
    public owner: string;
    
    /**
     * The purpose for this device - e.g. what does it do
     */
    public purpose: string;
    
    /**
     * A potential link to the thumbnail of the device
     */
    //TODO
    public thumbnail?: string;
}