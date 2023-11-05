import { ActionRow, ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CacheType, Colors, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import Command from "../structs/handlers/Command";
import ClientBot from "../structs/ClientBot";
import ProfileManager, { Profile } from "../structs/managers/ProfileManager";
import { User } from "../structs/managers/UserManager";

export default class ProfileCommand extends Command {

    constructor() {
        super('profile', 'view/create/delete profiles', [{
            name: 'create',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'ign',
                description: 'your in-game name for your profile',
                required: true,
                type: ApplicationCommandOptionType.String
            }],
            description: 'create a new profile'
        }, {
            name: 'view',
            description: 'view your or someone\'s profile',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'ign',
                description: 'view someone\'s profile by ign.',
                type: ApplicationCommandOptionType.String
            }, {
                name: 'mention',
                description: 'view someone\'s profile by mention.',
                type: ApplicationCommandOptionType.User
            }]
        }, {
            name: 'delete',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: 'ign',
                description: 'your in-game name to delete the profile',
                required: true,
                type: ApplicationCommandOptionType.String,
                autocomplete: true
            }],
            description: 'delete one of your profiles'
        }]);
    }
    
    async run(client: ClientBot, interaction: CommandInteraction<CacheType>, options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage">): Promise<void> {
        try {
            await interaction.deferReply();

            let subcmd = options.getSubcommand();
            if(!subcmd) return;

            switch(subcmd) {
                case 'view':
                    
                    var user = client.manager.getUser(interaction.user.id);
                    if(!user) {
                        await interaction.editReply(`You haven't created a profile yet! Use \`/profile create\` to create.`);
                        return;
                    }

                    var ign = options.getString('ign');
                    var currentProfile = user.profiles.find(a => ign ? (a.ign == ign) : a.current);

                    // TODO: continuation

                    break;
                case 'create':
                    var ign = options.getString('ign');
                    if(!ign) return;

                    var user = client.manager.getUser(interaction.user.id);
                    if(!user) {
                        client.manager.agreement(interaction, ign).then(async val => {
                            if(val == 'Agreed') {
                                user = client.manager.createUser(interaction.user.id, [
                                    ProfileManager.createProfile(ign)
                                ]);
                                await interaction.editReply({
                                    content: `You have agreed to create a profile. you can now access your profile with \`/profile view\``,
                                    embeds: [],
                                    components: []
                                }).catch(() => {});
                            } else if(val == 'Denied') {
                                await interaction.editReply({
                                    content: `You did not agree to create a profile. Hence nothing has been saved in our system.`,
                                    embeds: [],
                                    components: []
                                });
                            }
                        });
                    } else {
                        user.profiles.push(ProfileManager.createProfile(ign));
                        user.profiles = user.profiles.map(a => {
                            if(a.ign != ign) {
                                a.current = false;
                            }
                            return a;
                        })
                        client.manager.saveUser(user);
                        await interaction.editReply(`You have successfully created a new profile! You can now view it in \`/profile view\``)
                    }

                    break;
                case 'delete':
                    // TODO
                    break;
            }

        } catch (err) {
            console.error(err);
        }
    }

}