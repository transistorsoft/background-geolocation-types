import type { DesiredAccuracy } from '../../enums/DesiredAccuracy';

export interface WatchPositionRequest {
    /**
     * Sets the interval in milliseconds at which to fetch location updates.
     */
    interval?: number;
    /**
     * Sets the {@link DesiredAccuracy} of location updates from the native location API.
     * 
     * Defaults to {@link DesiredAccuracy.High}
     */
    desiredAccuracy?: DesiredAccuracy;
    /**
     * Defaults to `true` when plugin is `enabled`; `false`, otherwise.  Set `false` to disable persisting the retrieved Locations in the plugin's SQLite database.
     */
    persist?: boolean;
    /**
     * Optional meta-data to attach to each location. These `extras` will be merged to the configured {@link PersistenceConfig.extras} and persisted / POSTed to your server (if you've configured a {@link HttpConfig.url}).
     */
    extras?: Record<string, any>;
    /**
     * Location-timeout in `milliseconds`.  
     * 
     * Default: `60000`.
     */
    timeout?: number;
}