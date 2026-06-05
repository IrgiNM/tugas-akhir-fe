"use client";

import dynamic from "next/dynamic";

// ini penting: matikan SSR untuk map
const GeoMap = dynamic(() => import("./geoMap"), {
  ssr: false,
});

export default GeoMap;