import { frontendEventList } from "../../events";

const log = [
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
                "zScale": 0.1,
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
        "timestamp": 1547353836500,
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
        "timestamp": 1547353836508,
        "listeners": 0
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
            "x": 1,
            "y": 0
        },
        "timestamp": 1547353836508,
        "listeners": 1
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
            "x": 2,
            "y": 0
        },
        "timestamp": 1547353836513,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                0,
                -1,
                0
            ],
            "x": 3,
            "y": 0
        },
        "timestamp": 1547353836518,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                -1,
                0,
                -1
            ],
            "x": 3,
            "y": 0
        },
        "timestamp": 1547353836522,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                -1,
                0,
                0
            ],
            "x": 0,
            "y": 1
        },
        "timestamp": 1547353836525,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                -1,
                0,
                0
            ],
            "x": 1,
            "y": 1
        },
        "timestamp": 1547353836529,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                -1,
                0,
                0
            ],
            "x": 2,
            "y": 1
        },
        "timestamp": 1547353836532,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                -1,
                -1,
                0,
                0
            ],
            "x": 3,
            "y": 1
        },
        "timestamp": 1547353836534,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                0,
                1,
                1
            ],
            "x": 1,
            "y": 2
        },
        "timestamp": 1547353836537,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                1,
                0,
                1
            ],
            "x": 0,
            "y": 2
        },
        "timestamp": 1547353836541,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                0,
                0
            ],
            "x": 0,
            "y": 3
        },
        "timestamp": 1547353836544,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                0,
                1,
                0
            ],
            "x": 1,
            "y": 3
        },
        "timestamp": 1547353836548,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                1,
                0,
                1
            ],
            "x": 2,
            "y": 2
        },
        "timestamp": 1547353836549,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                1,
                0,
                1
            ],
            "x": 2,
            "y": 2
        },
        "timestamp": 1547353836552,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                0,
                1,
                1
            ],
            "x": 3,
            "y": 2
        },
        "timestamp": 1547353836554,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                0,
                0,
                1,
                1
            ],
            "x": 3,
            "y": 2
        },
        "timestamp": 1547353836555,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                0,
                1,
                0
            ],
            "x": 3,
            "y": 3
        },
        "timestamp": 1547353836559,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                0,
                1,
                0
            ],
            "x": 3,
            "y": 3
        },
        "timestamp": 1547353836561,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                0,
                0
            ],
            "x": 2,
            "y": 3
        },
        "timestamp": 1547353836563,
        "listeners": 1
    },
    {
        "event": {
            "kind": "mapEdit",
            "edit": [
                1,
                1,
                0,
                0
            ],
            "x": 2,
            "y": 3
        },
        "timestamp": 1547353836563,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "161f4b26-343c-4f0c-989e-4010f4334c4c",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 3,
                "y": 2,
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353836564,
        "listeners": 0
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "b01b6189-0df2-431f-9cf6-57f8bfa0080e",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 3,
                "y": 3,
                "color": "blue",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353836564,
        "listeners": 0
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "8cf61bf2-b565-414e-a058-5ad398a8d0e3",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 2,
                "y": 3,
                "color": "green",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353836565,
        "listeners": 0
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "45ebe4f9-e771-4a81-a5cb-c140f60c32d0",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 2,
                "y": 2,
                "color": "green",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353836565,
        "listeners": 0
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "green",
            "unitType": "tank"
        },
        "timestamp": 1547353841599,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "red",
            "unitType": "tank"
        },
        "timestamp": 1547353843303,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353846712,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353846729,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353846828,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353846845,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353846862,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                2
            ]
        },
        "timestamp": 1547353847845,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                3
            ]
        },
        "timestamp": 1547353847861,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                3
            ]
        },
        "timestamp": 1547353847877,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353847894,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353847911,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353847927,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353847930,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851361,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851378,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851394,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851411,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851428,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851444,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851461,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851479,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851497,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851728,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851744,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851761,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851780,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851794,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851813,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851828,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851847,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851862,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851878,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851894,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851928,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851945,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851962,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353851978,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852011,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852111,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852128,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852145,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852161,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852178,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852195,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852211,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852228,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852245,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852261,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852278,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852294,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852311,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852329,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852345,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852427,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852445,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852461,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852478,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852495,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852511,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852528,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852546,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852561,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852580,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852594,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852611,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852628,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852646,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852661,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852678,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852694,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852712,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852728,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852745,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852761,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852778,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852795,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852811,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852828,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852844,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852862,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852878,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852895,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852911,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852928,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852944,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852962,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852978,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353852996,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853011,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853111,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853329,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853344,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853362,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853379,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853394,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853411,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853428,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353853445,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353853461,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853478,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853495,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853511,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853528,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853544,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853629,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853647,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853662,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853679,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853695,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853711,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853728,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853745,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853762,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853778,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853795,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853811,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853827,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853846,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353853860,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854029,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854046,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854061,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854078,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854095,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854112,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854128,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353854145,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "green",
            "unitType": "tank"
        },
        "timestamp": 1547353855878,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857695,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857712,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857728,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857745,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857761,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857778,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857795,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353857797,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858678,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858695,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858712,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858728,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858745,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858763,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858779,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858795,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858811,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858828,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858845,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858862,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858878,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858895,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858913,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858929,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858945,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858978,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353858995,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859013,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859028,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859045,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859062,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859078,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859094,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859111,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859128,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859145,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859161,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353859179,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860295,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860312,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860329,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860345,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353860362,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860379,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860395,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860412,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860429,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860445,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860461,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860479,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860495,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860513,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860529,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860545,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860562,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860579,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860595,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860612,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860629,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860645,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860662,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860679,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860696,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860712,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860729,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353860745,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "blue",
            "unitType": "tank"
        },
        "timestamp": 1547353862226,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "red",
            "unitType": "tank"
        },
        "timestamp": 1547353869857,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353870896,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353870913,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353870930,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                2
            ]
        },
        "timestamp": 1547353870946,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                2
            ]
        },
        "timestamp": 1547353871363,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "38c5122f-98f8-4a9f-ad3e-50afb856de23",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 1,
                "y": 2,
                "color": "red",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353872138,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                3
            ]
        },
        "timestamp": 1547353872363,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                3
            ]
        },
        "timestamp": 1547353872382,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "c0a9252d-b98d-4c1a-a645-02de2c3a1e58",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 1,
                "y": 3,
                "color": "red",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353872810,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                3
            ]
        },
        "timestamp": 1547353872946,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353872997,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                3
            ]
        },
        "timestamp": 1547353873013,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873030,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873046,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873062,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873080,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873096,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873113,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873131,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873146,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873163,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873179,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873196,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873213,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873229,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873246,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873263,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873280,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873296,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873312,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873333,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873348,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873364,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873380,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873396,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873414,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873431,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873453,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873463,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873480,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873496,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873514,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873530,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873880,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873896,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873913,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873930,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873947,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353873964,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874030,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874047,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874063,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874080,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874096,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874113,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874130,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353874146,
        "listeners": 1
    },
    {
        "event": {
            "kind": "editorMode",
            "selection": "newUnit",
            "user": "white",
            "unitType": "tank"
        },
        "timestamp": 1547353875929,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353876264,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353876280,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353876297,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                2
            ]
        },
        "timestamp": 1547353876313,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                2
            ]
        },
        "timestamp": 1547353876363,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                1,
                2
            ]
        },
        "timestamp": 1547353876380,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                0,
                2
            ]
        },
        "timestamp": 1547353878980,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "812b56de-e51b-4c73-a26c-28c4f487ee8d",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 0,
                "y": 2,
                "color": "white",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353879518,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                0,
                3
            ]
        },
        "timestamp": 1547353879714,
        "listeners": 1
    },
    {
        "event": {
            "kind": "newUnit",
            "unit": {
                "uuid": "ce57bd19-5e69-42e2-89a7-f42bce1ada62",
                "type": "tank",
                "facing": "E",
                "size": 1,
                "x": 0,
                "y": 3,
                "color": "white",
                "map": "test",
                "moveCooldown": 0
            }
        },
        "timestamp": 1547353880154,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880330,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880347,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880364,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880380,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880397,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880414,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880430,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880447,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880469,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880481,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880497,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880547,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880564,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353880570,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353884831,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353884848,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353884864,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353884900,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                3
            ]
        },
        "timestamp": 1547353884932,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                2,
                2
            ]
        },
        "timestamp": 1547353885032,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353885049,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate",
            "loc": [
                3,
                2
            ]
        },
        "timestamp": 1547353885064,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885147,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885164,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885182,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885197,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885214,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885231,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885247,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885264,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885281,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885297,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885314,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885330,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885347,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885364,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885381,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885397,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885414,
        "listeners": 1
    },
    {
        "event": {
            "kind": "hilightUpdate"
        },
        "timestamp": 1547353885430,
        "listeners": 1
    },
    // padding events to make the log take longer before resetting
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
]

export const slopesTestLog = log.map((e) => e.event).filter((e) => !frontendEventList.includes(e.kind));