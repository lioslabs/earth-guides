import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic, Principal, serialize, Result } from 'azle';
import express from 'express';
import cors from 'cors';
import { hexAddressFromPrincipal } from "azle/canisters/ledger";

class pos {
  lng: number;
  lat: number;
}

class Group {
    id: string;
    name: string;
}

class User {
    id: string;
    name: string;
    groups: Groups[];
}

class Marker {
  id: string;
  position: pos;
  owner: Group;
  creator: string;
}

class Polyline {
  id: string;
  edges: pos[];
  owner: Group;
}

class Polygon {
  id: string;
  edges: pos[];
  owner: Group;
}

class Popup {
  id: string;
}

const userStorage = StableBTreeMap<string, User>(0);
const groupStorage = StableBTreeMap<string, Group>(1);
const markerStorage = StableBTreeMap<string, Markers>(2);
const polygonStorage = StableBTreeMap<string, Polygon>(3);
const popupStorage = StableBTreeMap<string, Popup>(4);


export default Server(() => {
    const app = express();
    // only for development purposes. For production-ready apps, one must configure CORS appropriately
    app.use(cors());
    app.use(express.json());

    app.get("/markers", (req, res) => {
        res.json(markerStorage.values());
    });

    app.get("/groups", (req, res) => {
        res.json(groupStorage.values());
    });

    app.get("/polygons", (req, res) => {
        res.json(polygonStorage.values());
    });

    app.get("/polylines", (req, res) => {
        res.json(polylineStorage.values());
    });

    app.get("/popups", (req, res) => {
        res.json(popupStorage.values());
    });
/*
    app.get("/user/:id", (req, res) => {
        const userId = req.params.id;
        const UserOpt = userStorage.get(UserId);
        if ("None" in userOpt) {
            res.status(404).send(`the user with id=${userID} not found`);
        } else {
            res.json(userOpt.Some);
        }
    });
*/
    app.post("/marker", (req, res) => {
        const payload = req.body as Marker;
        const marker = { id: uuidv4(), owner: "dedede", ...payload };
        markerStorage.insert(marker.id, marker);
        return res.json(marker);
    });
/*
    app.put("/marker/:id", (req, res) => {
        const markerId = req.params.id;
        const payload = req.body as MarkerPayload;
        const markerOpt = markersStorage.get(markerId);
        if ("None" in markerOpt) {
            res.status(400).send(`couldn't update a marker with id=${markerId}. marker not found`);
        } else {
            const marker = markerOpt.Some;
            const updatedMarker = { ...marker, ...payload, updatedAt: getCurrentDate() };
            markersStorage.insert(marker.id, updatedMarker);
            res.json(updatedMarker);
        }
    });

    app.delete("/marker/:id", (req, res) => {
        const markerId = req.params.id;
        const deletedMarkerOpt = markersStorage.remove(markerId);
        if ("None" in deletedMarkerOpt) {
            res.status(400).send(`couldn't delete a marker with id=${markerId}. marker not found`);
        } else {
            res.json(deletedMarkerOpt.Some);
        }
    });

      /*
        a helper function to get the address from the principal
        the address is later used in the transfer method
    */
    app.get("/principal-to-address/:principalHex", (req, res) => {
        const principal = Principal.fromText(req.params.principalHex);
        res.json({ account: hexAddressFromPrincipal(principal, 0) });
    });

    return app.listen();
});

function getCurrentDate() {
    const timestamp = new Number(ic.time());
    return new Date(timestamp.valueOf() / 1000_000);
}

async function allowanceTransfer(to: string, amount: bigint): Promise<Result<any, string>> {
    try {
        const response = await fetch(`icp://${ICRC_CANISTER_PRINCIPAL}/icrc2_transfer_from`, {
            body: serialize({
                candidPath: "/src/icrc1-ledger.did",
                args: [{
                    // for optional values use an empty array notation [] instead of None is they should remain empty
                    spender_subaccount: [],
                    created_at_time: [],
                    memo: [],
                    amount,
                    fee: [],
                    from: { owner: ic.caller(), subaccount: [] },
                    to: { owner: Principal.fromText(to), subaccount: [] }
                }]
            })
        });
        return Result.Ok(response);
    } catch (err) {
        let errorMessage = "an error occurred on approval";
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return Result.Err(errorMessage);
    }
}

const IRC_CANISTER_PRINCIPAL = "mxzio-ppokqk-uunede-pkiad-imo";
