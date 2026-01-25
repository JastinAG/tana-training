export const generateUniqueName = (prefix: string): string => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${randomSuffix}`;
  };
  

  export const buildBoardPayload = () => ({
    name: generateUniqueName('GR-Board'),
    defaultLists: false,
    prefs_permissionLevel: 'private' // Requirement GR-501
  });

  export const buildListPayload = (name?: string) => ({
    name: name || generateUniqueName('GR-List'),
  });

  export const buildCardPayload = (name?: string) => ({
    name: name || generateUniqueName('GR-Card'),
  });