export type UserInventory = {
    cases: number[];
    skins: number[];
    animations: number[];
    gloves: number[];
}

export type UserCurrency = {
    yellow_creds: number;
    blue_creds: number;
}

export type Profile = {
    current: boolean;
    inventory: UserInventory;
    ign: string;
    currency: UserCurrency;
}

export default class ProfileManager {

    constructor() {}
    
    static createProfile(ign: string): Profile {
        return {
            current: false,
            ign,
            currency: {
                blue_creds: 0,
                yellow_creds: 0,
            },
            inventory: {
                animations: [],
                cases: [],
                gloves: [],
                skins: []
            }
        }
    }

}