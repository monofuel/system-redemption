import { LoggedEvent } from "../../elements/eventContext";
import { FrontendEvent, ServerEvent, frontendEventList } from "../../events";

const log: any = [
    {
        "event": {
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
        "timestamp": 1547366225832,
        "listeners": 1
    },
    {
        "event": {
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
        "timestamp": 1547366225867,
        "listeners": 0
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "f392cc3f-c4a0-423f-841e-8d6fd27924f8",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "loc": [
                    0,
                    1
                ],
                "color": "yellow",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547366225867,
        "listeners": 0
    },
    {
        event: {
            kind: "selectUnits",
            uuids: ["f392cc3f-c4a0-423f-841e-8d6fd27924f8"]
        }
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                -1,
                -1,
                -1
            ],
            "x": 0,
            "y": 2
        },
        "timestamp": 1547366225868,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                1,
                1
            ],
            "x": 0,
            "y": 2
        },
        "timestamp": 1547366225884,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                1,
                1
            ],
            "x": 0,
            "y": 2
        },
        "timestamp": 1547366225891,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                1,
                1
            ],
            "x": 1,
            "y": 2
        },
        "timestamp": 1547366225906,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                1,
                1
            ],
            "x": 2,
            "y": 2
        },
        "timestamp": 1547366225913,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                1,
                1
            ],
            "x": 2,
            "y": 1
        },
        "timestamp": 1547366225924,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "blue",
            "unitType": "tank"
        },
        "timestamp": 1547366310617,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                1
            ]
        },
        "timestamp": 1547366310936,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                1
            ]
        },
        "timestamp": 1547366310953,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                1
            ]
        },
        "timestamp": 1547366311236,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                1
            ]
        },
        "timestamp": 1547366311254,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                1
            ]
        },
        "timestamp": 1547366311788,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                1
            ]
        },
        "timestamp": 1547366311803,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "2c3b08b5-ae90-482f-8fbd-36a100b3e55d",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "loc": [
                    1,
                    1
                ],
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547366312525,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                0
            ]
        },
        "timestamp": 1547366312820,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "4b91dfd4-fb7a-4550-8ab8-ad189db7ed4e",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "loc": [
                    1,
                    0
                ],
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547366313221,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                0
            ]
        },
        "timestamp": 1547366313619,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                0
            ]
        },
        "timestamp": 1547366313636,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "ebd6b81f-b6f9-44e7-bf08-aad041964080",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "loc": [
                    2,
                    0
                ],
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547366313917,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                1
            ]
        },
        "timestamp": 1547366314036,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "02a3f8af-6bcb-4b86-850b-3671d9c48de2",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "loc": [
                    2,
                    1
                ],
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547366314360,
        "listeners": 1
    },

    {
        event: {
            kind: "selectUnits",
            uuids: [
                "f392cc3f-c4a0-423f-841e-8d6fd27924f8",
                "2c3b08b5-ae90-482f-8fbd-36a100b3e55d",
                "4b91dfd4-fb7a-4550-8ab8-ad189db7ed4e",
                "02a3f8af-6bcb-4b86-850b-3671d9c48de2"
            ]
        }
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                0,
                0,
                0
            ],
            "x": 0,
            "y": 0
        },
        "timestamp": 1547353885431,
        "listeners": 0
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                0,
                0,
                0
            ],
            "x": 0,
            "y": 0
        },
        "timestamp": 1547353885431,
        "listeners": 0
    },
    {
        event: {
            kind: "selectUnits",
            uuids: [
            ]
        }
    },
]
export const selectionTestLog = log.map((e: LoggedEvent) => e.event).filter((e: FrontendEvent | ServerEvent) => !frontendEventList.includes(e.kind));