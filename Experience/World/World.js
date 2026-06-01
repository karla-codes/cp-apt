import * as THREE from 'three';
import Experience from '../Experience.js';
import Environment from './Environment.js';

export default class World {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		// wait for resources
		this.resources.on('ready', () => {
			console.log(this.resources.items);
			const model = this.resources.items.roomModel.scene;
			this.scene.add(model);
			// Setup
			// this.environment = new Environment();
		});
	}
}
