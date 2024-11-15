export const appwriteConfig = {
endpointUrl : process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
projectId : process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
databaseId : process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
bucketId : process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
usersCollectionId : process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
secretKey : process.env.NEXT_APPWRITE_KEY!,
}