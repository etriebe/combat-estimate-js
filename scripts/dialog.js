import { EncounterUtils5e } from "./dnd5e/EncounterUtils5e.js";
import { NPCActor5e } from "./dnd5e/NPCActor5e.js";
import { PCActor5e } from "./dnd5e/PCActor5e.js";
import { FoundryUtils } from "./utils/FoundryUtils.js";
import { GeneralUtils } from "./utils/GeneralUtils.js";
import { ActorUtils } from "./utils/ActorUtils.js";

export class CombatEstimateDialog extends FormApplication {
constructor() {
		super();
		this.friendlyCombatants = [];
		this.hostileCombatants = [];
	}

	static get defaultOptions() {
		let dialogTemplate = `modules/combat-estimate/templates/CombatEstimateDialog.hbs`;
		return { 
			...super.defaultOptions,
			title: game.i18n.localize('CE.dialog.title'),
			id: "CombatEstimateDialog",
			template: dialogTemplate,
			resizable: true,
			width: window.innerWidth > 700 ? 700 : window.innerWidth - 100,
			height: window.innerHeight > 800 ? 800 : window.innerHeight - 100
		}
	}

	async activateListeners(html) {
		super.activateListeners(html);
		const _this=this;
		this.populateCombatants();
	}

	populateCombatants()
	{
		const html = this.element;
		let $friendsList = html.find('#friendly-combatants ul').first();
		let $hostilesList = html.find('#hostile-combatants ul').first();
		if (!game.combat.isActive)
		{
			console.log(`No combat active.`)
			return;
		}

		let combatants = game.combat.combatants;

		for (let combatant of combatants)
		{
			let combatantDisposition = FoundryUtils.getCombatantDisposition(combatant);

			let actorObject = null;
			// Disposition is 1 for friendly, 0 for neutral, -1 for hostile
			switch (combatantDisposition)
			{
				case CONST.TOKEN_DISPOSITIONS.FRIENDLY:
					console.log(`Combatant ${combatant.name} is friendly`);
					$friendsList.append(`<li class="combatant-friendly">
							<div class="player-details">
								${combatant.name}
							</div>
						</li>`);
					actorObject = ActorUtils.getPCActorObject(combatant.actor);
					this.friendlyCombatants.push(actorObject);
					break;
				case CONST.TOKEN_DISPOSITIONS.NEUTRAL:
					console.log(`Combatant ${combatant.name} is neutral`);
					break;
					case CONST.TOKEN_DISPOSITIONS.HOSTILE:
					console.log(`Combatant ${combatant.name} is hostile`);
					actorObject = ActorUtils.getActorObject(combatant.actor);
					this.hostileCombatants.push(actorObject);
					$hostilesList.append(`<li class="combatant-hostile">
							<div class="player-details">
								${combatant.name}
							</div>
						</li>`);

					break;
				default:
					console.log(`Combatant ${combatant.name} has unexpected state.`);
					break;
			}
		}
	}
}

Hooks.once('ready', async () => {
	canvas.CombatEstimateDialog = new CombatEstimateDialog();
});