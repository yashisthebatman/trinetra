export default function GeoSpatialMap() {
  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>
      <iframe
        src="/map-view.html" // This points to the file in your /public directory
        title="Geospatial Document Map"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
}