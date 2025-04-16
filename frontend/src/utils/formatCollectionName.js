export const formatCollectionName = (name) => {
    if (!name) return "N/A";
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
};