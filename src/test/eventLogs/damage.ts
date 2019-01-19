import { ServerEvent, FrontendEvent } from "../../events";

export const damageTestLog: (ServerEvent | FrontendEvent)[] = [
    {
        "kind": "newFiniteMap",
        "map": {
            "name": "foobar",
            "version": 1,
            "tps": 2,
            "landColor": 4215094,
            "edgeColor": 7311936,
            "cliffColor": 3550758,
            "waterColor": 5484770,
            "sunColor": 13421772,
            "zScale": 0.2,
            "size": 1,
            "chunkSize": 3,
            "waterHeight": 1.8,
            "grid": [
                [
                    {
                        "x": 0,
                        "y": 0,
                        "grid": [
                            [
                                [
                                    1,
                                    1,
                                    1,
                                    1
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ]
                            ],
                            [
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ]
                            ],
                            [
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ],
                                [
                                    2,
                                    2,
                                    2,
                                    2
                                ]
                            ]
                        ]
                    }
                ]
            ]
        }
    },
    {
        "kind": "defineUnit",
        "unit": {
            "type": "tank",
            "size": 1,
            "buildTime": 10,
            "cost": 100,
            "maxHealth": 200,
            "layer": "ground",
            "graphical": {
                "model": "LightTankLvl1"
            },
            "move": {
                "cooldown": 1
            }
        }
    },
    {
        "kind": "defineUnit",
        "unit": {
            "type": "ltank2",
            "size": 1,
            "buildTime": 10,
            "cost": 100,
            "maxHealth": 200,
            "layer": "ground",
            "graphical": {
                "model": "LightTankLvl2"
            },
            "move": {
                "cooldown": 2
            }
        }
    },
    {
        "kind": "defineUnit",
        "unit": {
            "type": "ltank3",
            "size": 1,
            "buildTime": 10,
            "cost": 100,
            "maxHealth": 200,
            "layer": "ground",
            "graphical": {
                "model": "LightTankLvl3"
            },
            "move": {
                "cooldown": 3
            }
        }
    },
    {
        "kind": "defineUnit",
        "unit": {
            "type": "htank3",
            "size": 1,
            "buildTime": 10,
            "cost": 100,
            "maxHealth": 200,
            "layer": "ground",
            "graphical": {
                "model": "HeavyTankLvl3"
            },
            "move": {
                "cooldown": 3
            }
        }
    },
    {
        "kind": "editorMode",
        "selection": "newUnit",
        "user": "red",
        "unitType": "ltank3"
    },
    {
        "kind": "newUnit",
        "unit": {
            "uuid": "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
            "type": "ltank3",
            "facing": "E",
            "size": 1,
            "loc": "1:1",
            "color": "red",
            "map": "test",
            "moveCooldown": 0
        }
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 10,
    },
    {
        kind: 'damageUnit',
        uuid: "1d5a8002-6c64-480e-b3f3-d14fd0517a9a",
        amount: 1000,
    },
] as any;