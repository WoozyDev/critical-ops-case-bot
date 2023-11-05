import { readFileSync } from "fs";

export type ItemDefType = 'GloveSkin' | 'WeaponSkin' | 'WeaponAnimation' | 'Case' | 'Unknown';

export interface BaseItemDef<T extends ItemDefType> {
    type: T;
    id: number;
    tags: string[];
    series_tag: string;
    tier: number;
}

export enum GloveSkinTargetTeam {
    ALL,
    COALITION,
    BREACH
}

export interface GloveSkinItemDef extends BaseItemDef<'GloveSkin'> {
    faction_target: GloveSkinTargetTeam;
    name: string;
    is_default: boolean;
}

export enum WeaponAnimationType {
    RELOAD,
    INSPECT
}

export interface WeaponAnimationItemDef extends BaseItemDef<'WeaponAnimation'> {
    slot: WeaponAnimationType;
    name: string;
    is_default: boolean;
    weapon: string;
}

export interface WeaponSkinItemDef extends BaseItemDef<'WeaponSkin'> {
    weapon_name: string;
    skin_name: string;
    is_default: boolean;
}

export type RollData = {
    item_types: number[];
    drop_chances: number[];
    include_tags: string[];
    exclude_tags: string[];
    amounts: number[];
}

export interface CaseItemDef extends BaseItemDef<'Case'> {
    name: string;
    roll_data: RollData[];
}

export type ItemDef = GloveSkinItemDef | WeaponAnimationItemDef | WeaponSkinItemDef | CaseItemDef | BaseItemDef<'Unknown'>;

export default class ItemDefinitionManager {

    cases: BaseItemDef<'Case'>[];
    gloves: BaseItemDef<'GloveSkin'>[];
    animations: BaseItemDef<'WeaponAnimation'>[];
    weapon_skins: BaseItemDef<'WeaponSkin'>[];
    constructor() {
        this.cases = [];
        this.gloves = [];
        this.animations = [];
        this.weapon_skins = [];
    }

    initialize() {

        let file = JSON.parse(readFileSync('./item_defs.json', 'utf8'));
        let version = file.version;
        let defs = file.item_definitions.item_types;

        // cases
        let case_defs = defs.find(a => a.id == 6);
        case_defs.items.forEach(item => {
            let data: ItemDef = {
                type: "Case",
                id: item.id,
                series_tag: item.series_tag,
                tags: item.tags,
                tier: item.tier,
                name: item.name,
                roll_data: item.roll_data
            };
            this.cases.push(data);
        });

        // gloves
        let glove_defs = defs.find(a => a.id == 8);
        glove_defs.items.forEach(item => {
            let data: ItemDef = {
                type: 'GloveSkin',
                id: item.id,
                faction_target: item.faction_target,
                is_default: item.is_default,
                name: item.name.split(' ').slice(1).join(' '),
                series_tag: item.series_tag,
                tags: item.tags,
                tier: item.tier
            };
            this.gloves.push(data);
        });

        // animations
        let animation_defs = defs.find(a => a.id == 5);
        animation_defs.items.forEach(item => {
            let data: ItemDef = {
                type: 'WeaponAnimation',
                id: item.id,
                is_default: item.is_default,
                name: item.name,
                series_tag: item.series_tag,
                slot: item.animation_slot,
                tags: item.tags,
                tier: item.tier,
                weapon: item.display_header
            }
            this.animations.push(data);
        });

        // weapon skin
        let skin_defs = defs.find(a => a.id == 3);
        skin_defs.items.forEach(item => {
            let data: ItemDef = {
                type: 'WeaponSkin',
                id: item.id,
                is_default: item.is_default,
                series_tag: item.series_tag,
                skin_name: item.display_name,
                tags: item.tags,
                tier: item.tier,
                weapon_name: item.display_header
            };
            this.weapon_skins.push(data);
        });
    }

}