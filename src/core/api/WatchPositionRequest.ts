import type { DesiredAccuracy } from '../../enums/DesiredAccuracy';

export interface WatchPositionRequest {
    /**
     * <!-- doc-id: WatchPositionRequest.interval -->
     * Sets the interval in milliseconds at which to fetch location updates.
     */
    interval?: number;
    /**
     * <!-- doc-id: WatchPositionRequest.desiredAccuracy -->
     * Sets the {@link DesiredAccuracy} of location updates from the native location API.
     * 
     * Defaults to {@link DesiredAccuracy.High}
     */
    desiredAccuracy?: DesiredAccuracy;
    /**
     * <!-- doc-id: WatchPositionRequest.persist -->
     * Defaults to `true` when plugin is `enabled`; `false`, otherwise.  Set `false` to disable persisting the retrieved Locations in the plugin's SQLite database.
     */
    persist?: boolean;
    /**
     * <!-- doc-id: WatchPositionRequest.extras -->
     * Optional meta-data to attach to each location. These `extras` will be merged to the configured {@link PersistenceConfig.extras} and persisted / POSTed to your server (if you've configured a {@link HttpConfig.url}).
     */
    extras?: Record<string, any>;
    /**
     * <!-- doc-id: WatchPositionRequest.timeout -->
     * Location-timeout in `milliseconds`.  
     * 
     * Default: `60000`.
     */
    timeout?: number;
}