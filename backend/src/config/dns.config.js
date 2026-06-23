import dns from "node:dns";

// Node's default DNS resolver can fail SRV lookups (querySrv ECONNREFUSED)
// when the system DNS server doesn't support/allow SRV records.
// Point the resolver at public DNS servers so mongodb+srv:// lookups work.
// This module is imported first (before any code that opens a Mongo connection)
// so the setting is applied before the first SRV query is issued.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
