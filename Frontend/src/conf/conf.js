const cleanEnv = (val) => {
    if (!val || val === 'undefined') return '';
    let str = String(val).trim();
    // Strip wrapping quotes if user entered them in Vercel UI or .env
    if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
        str = str.slice(1, -1).trim();
    }
    return str;
};

const conf = {
    appwriteUrl: cleanEnv(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: cleanEnv(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: cleanEnv(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: cleanEnv(import.meta.env.VITE_APPWRITE_COLLECTION_ID), 
    appwriteBucketId: cleanEnv(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteCommentId: cleanEnv(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
};

export default conf;