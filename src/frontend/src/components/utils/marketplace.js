//import { approve } from "./icrc2_ledger";
import { createCanisterActor } from "./canisterFactory";
import { idlFactory as marketPlaceIDL } from "../../../../declarations/backend/backend.did.js";
import IcHttp from "./ichttp";

const marketplaceAgentCanister = await createCanisterActor(process.env.BACKEND_CANISTER_ID, marketPlaceIDL);
const httpClient = new IcHttp(marketplaceAgentCanister);
console.log(marketplaceAgentCanister);
console.log(process.env.BACKEND_CANISTER_ID);
export async function createMarker(data) {
    return httpClient.POST({path: "/marker", data: data});
}

export async function getAddressFromPrincipal(principalHex) {
    return httpClient.GET({path: `/principal-to-address/${principalHex}`});
}

export async function getMarkers() {
    return httpClient.GET({path: "/markers"});
}
