* Service for loading in the mint request and then just slowing beginning to mint, gracefully handling errors and ensuring successes
    * Will require prefunding
    * Should handle cases where you won't be able to mint
    * Should allow budget top-ups
* Service for handling event ingestion into a set of DBs
    * KV
    * D1
    * R2
    * Images
* Handle bumping/restoring all the things in a robust cron task and Durable Objects alarm system
    * Contract instance
    * Wasm blob
    * All the Glyphs
    * All the Offers
    * All the Balances
    * Etc. There's a lot of stored stuff