import { ServerEvent, FrontendEvent } from "../../events";
import { defaultUnitDefinitions } from "./units";

export const hilightTestLog: (ServerEvent | FrontendEvent)[] = [
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
            "zScale": 0.4,
            "size": 2,
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
                                    3,
                                    3,
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
                                    3,
                                    2,
                                    3,
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
                                    3,
                                    3
                                ],
                                [
                                    2,
                                    3,
                                    2,
                                    3
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
                                    3,
                                    2,
                                    3,
                                    3
                                ],
                                [
                                    3,
                                    3,
                                    3,
                                    3
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
                    },
                    {
                        "x": 0,
                        "y": 1,
                        "grid": [
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
                ],
                [
                    {
                        "x": 1,
                        "y": 0,
                        "grid": [
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
                    },
                    {
                        "x": 1,
                        "y": 1,
                        "grid": [
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
    ...defaultUnitDefinitions,

    {
        kind: 'hilightUpdate',
        loc: '1:1'
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2'
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [0]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [1]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [2]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [3]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [0, 3]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [0, 1, 3]
    },

    {
        kind: 'hilightUpdate',
        loc: '2:2',
        corner: [0, 1, 2, 3]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:1',
        corner: [0, 1]
    },
    {
        kind: 'hilightUpdate',
        loc: '2:0',
        corner: [2, 3]
    },
    {
        kind: 'hilightUpdate',
        loc: '3:1',
        corner: [1, 2]
    },
    {
        kind: 'hilightUpdate',
        loc: '0:1',
        corner: [2, 1]
    },
    {
        kind: 'hilightUpdate',
        loc: '1:2',
        corner: [0, 1, 3]
    }


]