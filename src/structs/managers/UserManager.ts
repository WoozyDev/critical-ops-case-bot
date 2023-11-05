import { readFileSync, writeFileSync } from "fs";
import { Profile } from "./ProfileManager";



export type User = {
    id: string;
    profiles: Profile[];
}

export default class UserManager {

    cache_interval: NodeJS.Timeout;
    private _cache: User[] = null;
    constructor() {
        this._cache = this.cache;
        this.cacheSystem();
    }

    createUser(id: string, profiles: Profile[]) {
        let user: User = {
            id,
            profiles
        }
        this._cache.push(user);
        return user;
    }

    deleteUser(id: string) {
        this._cache = this._cache.filter(a => a.id != id);
    }

    addProfile(id: string, profile: Profile) {
        this._cache = this._cache.map(a => {
            if(a.id == id) {
                a.profiles.push(profile);
            }
            return a;
        });
    }

    removeProfile(id: string, ign: string) {
        this._cache = this._cache.map(a => {
            if(a.id == id) {
                a.profiles = a.profiles.filter(a => a.ign != ign);
            }
            return a;
        });
    }

    addCredits(type: 'yellow' | 'blue', amount: number, id: string, ign: string = null) {
        let user = this._cache.find(a => a.id == id);
        if(!user) return;
        let profile = user.profiles.find(a => ign ? (a.ign == ign) : a.current);
        if(!profile) return;
        this._cache.map(a => {
            if(a.id == id) {
                a.profiles = a.profiles.map(b => {
                    if(b.ign == profile.ign) {
                        b.currency[type == 'yellow' ? 'yellow_creds' : 'blue_creds'] += amount;
                    }
                    return b;
                });
            }
            return a;
        });
    }

    setCredits(type: 'yellow' | 'blue', amount: number, id: string, ign: string = null) {
        let user = this._cache.find(a => a.id == id);
        if(!user) return;
        let profile = user.profiles.find(a => ign ? (a.ign == ign) : a.current);
        if(!profile) return;
        this._cache.map(a => {
            if(a.id == id) {
                a.profiles = a.profiles.map(b => {
                    if(b.ign == profile.ign) {
                        b.currency[type == 'yellow' ? 'yellow_creds' : 'blue_creds'] = amount;
                    }
                    return b;
                });
            }
            return a;
        });
    }

    removeCredits(type: 'yellow' | 'blue', amount: number, id: string, ign: string = null) {
        let user = this._cache.find(a => a.id == id);
        if(!user) return;
        let profile = user.profiles.find(a => ign ? (a.ign == ign) : a.current);
        if(!profile) return;
        this._cache.map(a => {
            if(a.id == id) {
                a.profiles = a.profiles.map(b => {
                    if(b.ign == profile.ign) {
                        b.currency[type == 'yellow' ? 'yellow_creds' : 'blue_creds'] -= amount;
                    }
                    return b;
                });
            }
            return a;
        });
    }

    get cache() {
        if(this._cache == null) this._cache = JSON.parse(readFileSync(`./users.json`, 'utf8'));
        return this._cache;
    }

    cacheSystem() {
        this.cache_interval = setInterval(() => {
            writeFileSync(`./users.json`, JSON.stringify(this._cache, null, 4));
        }, 1 * 60 * 1000);
    }

}