// Debug utility to test room creation data format
export const debugRoomData = (formData: any) => {
  const formattedData = {
    ...formData,
    description: formData.description || '',
    amenities: Array.isArray(formData.amenities) 
      ? JSON.stringify(formData.amenities) 
      : formData.amenities || '[]',
    isActive: formData.isActive !== undefined ? formData.isActive : true
  };
  
  console.log('=== DEBUG ROOM DATA ===');
  console.log('Original formData:', formData);
  console.log('Formatted for backend:', formattedData);
  console.log('JSON string that will be sent:', JSON.stringify(formattedData, null, 2));
  console.log('======================');
  
  return formattedData;
};
