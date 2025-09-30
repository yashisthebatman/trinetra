// frontend/src/mock/geoMockData.ts

export const longContent = {
    report: `<p class="mb-4 text-gray-700 leading-relaxed">This comprehensive report outlines the critical assessment of flood preparedness protocols for the Aluva station...`, // Keep the full content from the original file
    plan: `<p class="mb-4 text-gray-700 leading-relaxed">The integration of the Palarivattom Metro Station with the rebuilt Palarivattom Flyover...`, // Keep the full content
    legal: `<p class="mb-4 text-gray-700 leading-relaxed">This document constitutes the official lease agreement between the Kochi Metro Rail Limited (KMRL)...`, // Keep the full content
};

export const mockStations = [
    { id: 1, name: 'Aluva', coords: [10.1032, 76.3518] as [number, number] },
    { id: 2, name: 'Palarivattom', coords: [10.0075, 76.3101] as [number, number] },
    { id: 3, name: 'Maharaja\'s College', coords: [9.9722, 76.2861] as [number, number] },
    { id: 4, name: 'Vyttila', coords: [9.9734, 76.3148] as [number, number] },
    { id: 5, name: 'Thykoodam', coords: [9.9634, 76.3175] as [number, number] },
    { id: 6, name: 'Pettah', coords: [9.9525, 76.3268] as [number, number] },
    { id: 7, name: 'SN Junction', coords: [9.9468, 76.3411] as [number, number] },
    { id: 8, name: 'Tripunithura Terminal', coords: [9.9465, 76.3532] as [number, number] }
];

export const mockDocuments = [
    { id: 101, stationId: 1, title: 'Aluva Station Flood Preparedness Report', type: 'PDF', date: '2025-09-27', content: longContent.report },
    { id: 102, stationId: 1, title: 'Feeder Service Schedule - Aluva', type: 'XLSX', date: '2025-09-15', content: longContent.plan },
    { id: 103, stationId: 2, title: 'Palarivattom Flyover Integration Plan', type: 'DOCX', date: '2025-08-01', content: longContent.plan },
    { id: 104, stationId: 3, title: 'Maharaja\'s College Ground Lease Agreement', type: 'PDF', date: '2025-07-22', content: longContent.legal },
    { id: 105, stationId: 4, title: 'Vyttila Mobility Hub Advertising Revenue', type: 'Log', date: '2025-09-25', content: longContent.report },
    { id: 106, stationId: 4, title: 'Water Metro Connectivity Report - Vyttila', type: 'PPTX', date: '2025-06-11', content: longContent.plan },
    { id: 107, stationId: 5, title: 'Thykoodam Bridge Maintenance Log', type: 'PDF', date: '2025-09-02', content: longContent.legal },
    { id: 108, stationId: 6, title: 'Pettah Station Passenger Flow Analysis', type: 'DOCX', date: '2025-05-19', content: longContent.report },
    { id: 109, stationId: 7, title: 'SN Junction Land Acquisition Documents', type: 'XLSX', date: '2025-04-30', content: longContent.legal },
    { id: 110, stationId: 8, title: 'Tripunithura Terminal Inauguration Plan', type: 'PDF', date: '2025-09-10', content: longContent.plan }
];

export const fileIcons = {
    'PDF': { icon: 'fa-file-pdf', color: 'text-red-500' },
    'XLSX': { icon: 'fa-file-excel', color: 'text-green-500' },
    'DOCX': { icon: 'fa-file-word', color: 'text-blue-500' },
    'PPTX': { icon: 'fa-file-powerpoint', color: 'text-orange-500' },
    'Log': { icon: 'fa-file-csv', color: 'text-yellow-500' }
};