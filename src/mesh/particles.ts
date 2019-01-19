import { ImageUtils, Vector2, AdditiveBlending, Vector3, Color, Group, Mesh } from "three";

const explosionTex = ImageUtils.loadTexture('/scripts/sprite-explosion2.png');

declare const SPE: any;

export declare interface SPEGroup {
    tick: (delta: number) => void;
    mesh: Mesh;
    dispose: () => void;

}

export function getExplosionGroup(): SPEGroup {

    const explosionGroup = new SPE.Group({
        texture: {
            value: explosionTex,
            frames: new Vector2(5, 5),
            loop: 1
        },
        depthTest: true,
        depthWrite: false,
        blending: AdditiveBlending,
        scale: 20
    });

    const fireball = new SPE.Emitter({
        particleCount: 20,
        type: SPE.distributions.SPHERE,
        position: {
            radius: 1
        },
        maxAge: { value: 0.2 },
        duration: 0.3,
        activeMultiplier: 20,
        velocity: {
            value: new Vector3(3)
        },
        size: { value: [20, 100] },
        color: {
            value: [
                new Color(0.5, 0.1, 0.05),
                new Color(0.2, 0.2, 0.2)
            ]
        },
        opacity: { value: [0.5, 0.35, 0.1, 0] }
    });

    explosionGroup.addEmitter(fireball);

    return explosionGroup;
}