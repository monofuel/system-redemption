import { LoggedEvent } from "../../elements/eventContext";
import { FrontendEvent, ServerEvent, frontendEventList, Assertion, GameStage } from "../../events";
import { GameState } from "../../events/state";
import { assert } from 'chai';
import { AssertionError, deepEqual } from "assert";


const tankUUID = "e3798619-9d8b-422e-b61c-ed84a1272577";

const log: any = [
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
            "chunkSize": 4,
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
                "cooldown": 2
            }
        }
    },
    {
        "kind": "editorMode",
        "selection": "raiselower",
        "user": "blue",
        "unitType": "tank"
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            0
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            0,
            0
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            0,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        "x": 0,
        "y": 0
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            1
        ],
        "corner": [
            2
        ]
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "editorMode",
        "selection": "newUnit",
        "user": "blue",
        "unitType": "tank"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            0,
            0
        ]
    },
    {
        "kind": "newUnit",
        "unit": {
            "uuid": "e3798619-9d8b-422e-b61c-ed84a1272577",
            "type": "tank",
            "facing": "E",
            "size": 1,
            "loc": [
                0,
                0
            ],
            "color": "blue",
            "map": "test",
            "moveCooldown": 0
        }
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            1
        ]
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "editorMode",
        "selection": "raiselower",
        "user": "blue",
        "unitType": "tank"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        "x": 1,
        "y": 1
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            1
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            3
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            3
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            3
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            2
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            2
        ],
        "corner": [
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            2
        ],
        "corner": [
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            1
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            2
        ],
        "corner": [
            3,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            0,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            0,
            1,
            2,
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            1,
            1
        ],
        "corner": [
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            1
        ],
        "corner": [
            3
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            1,
            0
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            2,
            0
        ],
        "corner": [
            1,
            2
        ]
    },
    {
        "kind": "hilightUpdate",
        "loc": [
            3,
            0
        ],
        "corner": [
            3,
            2
        ]
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        "kind": "hilightUpdate"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([0, 0], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "E"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([1, 0], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },

    {
        kind: 'assertFail',
        event: {
            kind: 'moveUnit',
            uuid: tankUUID,
            dir: 'N',
        }
    },

    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "E"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([2, 0], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "N"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([2, 1], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        kind: 'assertFail',
        event: {
            kind: 'moveUnit',
            uuid: tankUUID,
            dir: 'W',
        }
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "N"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([2, 2], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "W"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([1, 2], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        kind: 'assertFail',
        event: {
            kind: 'moveUnit',
            uuid: tankUUID,
            dir: 'S',
        }
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "W"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([0, 2], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "moveUnit",
        "uuid": tankUUID,
        "dir": "S"
    },
    {
        kind: 'assertion',
        fn: (state: GameState) => {
            assert.deepEqual([0, 1], state.units[tankUUID].loc);
        }
    },
    {
        "kind": "gameTick"
    },
    {
        "kind": "gameTick"
    },
    {
        kind: 'assertFail',
        event: {
            kind: 'moveUnit',
            uuid: tankUUID,
            dir: 'E',
        }
    },
]

export const moveBlockTestLog = log.filter((e: FrontendEvent | ServerEvent) => !frontendEventList.includes(e.kind));