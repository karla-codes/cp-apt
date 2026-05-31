import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
	constructor(sources) {
		super();

		// options
		this.sources = sources;
		this.bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

		// setup
		this.items = {};
		this.toLoad = this.sources.length;
		this.loaded = 0;

		this.setLoaders();
		this.startLoading();
	}

	setLoaders() {
		this.loaders = {};
		this.loaders.gltfLoader = new GLTFLoader();
		this.loaders.textureLoader = new THREE.TextureLoader();
		this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
	}

	startLoading() {
		for (const source of this.sources) {
			if (source.type === 'gltfModel') {
				this.loaders.gltfLoader.load(source.path, (file) => {
					// add material to all objects in scene
					file.scene.traverse((child) => {
						child.material = this.bakedMaterial;
					});
					this.sourceLoaded(source, file);
				});
			} else if (source.type === 'texture') {
				this.loaders.textureLoader.load(source.path, (file) => {
					this.sourceLoaded(source, file);
				});
			} else if (source.type === 'cubeTexture') {
				this.loaders.cubeTextureLoader.load(source.path, (file) => {
					this.sourceLoaded(source, file);
				});
			}
		}
	}

	sourceLoaded(source, file) {
		this.items[source.name] = file;

		this.loaded++;

		if (this.loaded === this.toLoad) {
			console.log('finished');
			this.trigger('ready');
			const texture = this.items.roomTexture;
			texture.flipY = false;
			texture.colorSpace = THREE.SRGBColorSpace;
			// set model texture
			this.bakedMaterial.map = texture;
		}
	}
}
