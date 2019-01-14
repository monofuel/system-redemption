import { FrontendEvent, ServerEvent, frontendEventList, EditorSelection } from "../../events";
import { defaultUnitDefinitions } from "./units";
import { UnitType, ModelType, GameColors } from "../../types/SR";

const log: (ServerEvent | FrontendEvent)[] = [
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
        kind: 'defineUnit',
        unit: {
            type: UnitType.tank,
            size: 1,
            buildTime: 10,
            cost: 100,
            maxHealth: 200,
            layer: 'ground',
            graphical: {
                model: ModelType.LightTankLvl1,
            },
            move: {
                cooldown: 2
            }
        }
    },
    {
        "kind": "newUnit",
        "unit": {
            "uuid": "f392cc3f-c4a0-423f-841e-8d6fd27924f8",
            type: UnitType.tank,
            "facing": "E",
            "size": 1,
            "loc": '0:1',
            "color": GameColors.yellow,
            "map": "test",
            "moveCooldown": 0
        }
    },
    {
        "kind": "selectUnits",
        "uuids": [
            "f392cc3f-c4a0-423f-841e-8d6fd27924f8"
        ]
    },
    {
        "kind": "mapEdit",
        "edit": [
            -1,
            -1,
            -1,
            -1
        ],
        loc: '0:2',
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        loc: '0:2'
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        loc: '0:2'
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        loc: '1:2'
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        loc: '2:2'
    },
    {
        "kind": "mapEdit",
        "edit": [
            1,
            1,
            1,
            1
        ],
        loc: '2:1'
    },
    {
        "kind": "editorMode",
        "selection": EditorSelection.newUnit,
        "user": GameColors.blue,
        "unitType": UnitType.tank
    },
    {
        "kind": "newUnit",
        "unit": {
            "uuid": "2c3b08b5-ae90-482f-8fbd-36a100b3e55d",
            "type": "tank",
            "facing": "E",
            "size": 1,
            loc: '1:1',
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
        "kind": "newUnit",
        "unit": {
            "uuid": "4b91dfd4-fb7a-4550-8ab8-ad189db7ed4e",
            "type": "tank",
            "facing": "E",
            "size": 1,
            loc: '1:0',
            "color": "blue",
            "map": "test",
            "moveCooldown": 0
        }
    },

    {
        "kind": "newUnit",
        "unit": {
            "uuid": "ebd6b81f-b6f9-44e7-bf08-aad041964080",
            "type": "tank",
            "facing": "E",
            "size": 1,
            loc: '2:0',
            "color": "blue",
            "map": "test",
            "moveCooldown": 0
        }
    },

    {
        "kind": "newUnit",
        "unit": {
            "uuid": "02a3f8af-6bcb-4b86-850b-3671d9c48de2",
            "type": "tank",
            "facing": "E",
            "size": 1,
            loc: '2:1',
            "color": "blue",
            "map": "test",
            "moveCooldown": 0
        }
    },
    {
        "kind": "selectUnits",
        "uuids": [
            "f392cc3f-c4a0-423f-841e-8d6fd27924f8",
            "2c3b08b5-ae90-482f-8fbd-36a100b3e55d",
            "4b91dfd4-fb7a-4550-8ab8-ad189db7ed4e",
            "02a3f8af-6bcb-4b86-850b-3671d9c48de2"
        ]
    },
    {
        "kind": "mapEdit",
        "edit": [
            0,
            0,
            0,
            0
        ],
        loc: '0:0'
    },
    {
        "kind": "mapEdit",
        "edit": [
            0,
            0,
            0,
            0
        ],
        loc: '0:0'
    },
    {
        "kind": "selectUnits",
        "uuids": []
    }
] as any;
export const selectionTestLog = log.filter((e: FrontendEvent | ServerEvent) => !frontendEventList.includes(e.kind));