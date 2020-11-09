const {
    AuthorizationCodeCredential
} = require("@azure/identity");
const {
    BlobServiceClient
} = require("@azure/storage-blob");


const tenantId = "fbfaa1d1-625f-4943-b085-a6c5cc7da133";
const clientId = "04a67731-bce6-4dd6-aee8-9260249dbd1b";
const redirectUri = "http://localhost:3000/";
const authorityHost = "https://login.microsoftonline.com";
const scopes = "https://storage.azure.com/user_impersonation";

/**
 * Storage Client Library: https://docs.microsoft.com/en-us/javascript/api/overview/azure/storage-blob-readme?view=azure-node-latest
 * 
 * @param {} defaultAzureCredential 
 */
export async function callAzureStorage(endpoint, response, callback) {
    const account = "supermanhebe";
    const credential = await getCredential(response.accessToken);
    const blobServiceClient = new BlobServiceClient(
        "https://supermanhebe.blob.core.windows.net",
        credential
    );    
    let i = 1;
    let containers = blobServiceClient.listContainers();
    for await (const container of containers) {
        console.log(`Container ${i++}: ${container.name}`);
    }
    return callback(containers, endpoint);
}

export async function getCredential(authorizationCode) {
    return new AuthorizationCodeCredential(
        tenantId,
        clientId,
        authorizationCode,
        redirectUri,
        // NOTE: It is not necessary to explicitly pass the authorityHost when using
        // the default authority host: https://login.microsoftonline.com.  It is only
        // necesary when a different authority host is used in the initial authorization
        // URI.
        { authorityHost }
      );

}

// Add here the endpoints for MS Graph API services you would like to use.
const storageConfig = {
    azureStorageEndpoint: "https://supermanhebe.blob.core.windows.net/?comp=list"
};


/** 
 * Helper function to call Azure Storage API endpoint
 * using the authorization bearer token scheme
 * Based on: https://docs.microsoft.com/en-us/rest/api/storageservices/authorize-with-azure-active-directory
 */
export function callAzureStorageREST(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("x-ms-version", "2017-11-09");
    headers.append("Accept", "*/*");
    headers.append("Host", "supermanhebe.blob.core.windows.net");
    headers.append("accept-encoding", "gzip, deflate");
    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}