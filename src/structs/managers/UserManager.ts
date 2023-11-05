import { readFileSync, writeFileSync } from "fs";
import { Profile } from "./ProfileManager";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction } from "discord.js";



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

    getUser(id: string) {
        return this._cache.find(a => a.id == id);
    }

    saveUser(user: User) {
        if(this._cache.find(a => a.id == user.id)) {
            this._cache = this._cache.map(a => {
                if(a.id == user.id) a = user;
                return a;
            });
        } else {
            this._cache.push(user);
        }
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

    async agreement(interaction: CommandInteraction<CacheType>, ign: string): Promise<'Agreed' | 'Denied'> {
        return new Promise(async (resolve, reject) => {
            var msg = await interaction.editReply({
                embeds: [{
                    title: '✅ Case Bot Usage',
                    description: [
                        `By clicking the button below, you agree for your Discord ID to be saved so we can get your Case Bot account.`,
                        `However, you can delete your Case bot account -- and your Discord ID will be forever deleted off our system -- anytime by using \`/profile delete ${ign}\`.`,
                        `Do you wish to proceeed?`
                    ].join('\n'),
                    color: Colors.Aqua,
                    timestamp: new Date().toString()
                }],
                components: [
                    new ActionRowBuilder<ButtonBuilder>()
                        .setComponents([
                            new ButtonBuilder()
                                .setLabel('Agree')
                                .setCustomId(`agree-case-bot-${interaction.user.id}`)
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setLabel('No')
                                .setCustomId(`no-case-bot-${interaction.user.id}`)
                                .setStyle(ButtonStyle.Danger)
                        ])
                ]
            });
            msg.awaitMessageComponent({
                filter: (btn) => btn.user.id == interaction.user.id && [`agree-case-bot-${interaction.user.id}`, `no-case-bot-${interaction.user.id}`].includes(btn.customId)
            }).then(async btn => {
                await btn.deferUpdate().catch(() => {});
                if(btn.customId.includes('agree')) {
                    resolve('Agreed');
                } else {
                    resolve('Denied');
                }
            })
        })
    }

}