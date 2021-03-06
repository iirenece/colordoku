export const GEOMETRIES = [
    {
        "id": 0,
        "name": "Icosaedro",
        "vertices": [
            [ 0, -30.9,  100],
            [ 0, 30.9,  100],
            [ 50,  0,  80.9],
            [ -50,  0,  80.9],
            [ 30.9, -50, 50],
            [ 30.9, 50, 50],
            [ -30.9, 50, 50],
            [ -30.9, -50, 50],
            [ 50, 0, 19.09],
            [ -50, 0, 19.09],
            [ 0, -30.9, 0],
            [ 0, 30.9, 0]
        ],
        "faces": [
            [ 0, 2, 1],
            [ 0, 1, 3],
            [ 0, 4, 2],
            [ 0, 7, 4],
            [ 0, 3, 7],
            [ 1, 6, 3],
            [ 1, 5, 6],
            [ 1, 2, 5],
            [ 2, 8, 5],
            [ 2, 4, 8],
            [ 3, 6, 9],
            [ 3, 9, 7],
            [ 7, 9, 10],
            [ 4, 7, 10],
            [ 4, 10, 8],
            [ 8, 10, 11],
            [ 9, 11, 10],
            [ 5, 8, 11],
            [ 6, 11, 9],
            [ 5, 11, 6]
        ],
        "minRange": 5,
        "maxRange": 19
    },
    {
        "id": 1,
        "name": "Triaquistetraedro",
        "vertices": [
            [-50.5, 49.93119812011719, 100.5],
            [-50.5, -50, 1.43130111694336],
            [49.43130111694336, -50, 100.5],
            [49.43130111694336, 49.93119812011719, 1.43130111694336],
            [35.00740051269531, 35.50740051269531, 86.07619857788086],
            [-36.07619857788086, 35.50740051269531, 25.00740051269531],
            [-36.07619857788086, -36.423800468444824, 86.07619857788086],
            [42.21929931640625, -43.211919784545898, 8.21929931640625]
        ],
        "faces": [
            [0, 6, 4],
            [6, 2, 4],
            [0, 1, 6],
            [0, 5, 1],
            [6, 1, 2],
            [2, 1, 7],
            [2, 7, 4],
            [7, 3, 4],
            [0, 4, 5],
            [4, 3, 5],
            [1, 3, 7],
            [1, 5, 3]
        ],
        "minRange": 3,
        "maxRange": 11
    },
    {
        "id": 2,
        "name": "Tetraquishexaedro",
        "vertices": [
            [ 24.88249969482422, 25, 75 ],
            [ 24.88249969482422, 25, 25],
            [ -25.352500915527344, 25, 25],
            [ -25.352500915527344, 25, 75],
            [ 24.88249969482422, -25, 25],
            [ 24.88249969482422, -25, 75],
            [ -25.352500915527344, -25, 25],
            [ -25.352500915527344, -25, 75],
            [ -0.23499999940395355, 0, 0],
            [ -0.23499999940395355, 50, 50],
            [ -0.23499999940395355, -50, 50],
            [ -50.470001220703125, 0, 50],
            [ -0.23499999940395355, 0, 100],
            [ 50, 0, 50]
        ],
        "faces": [
            [5, 7, 10],
            [7, 6, 10],
            [6, 4, 10],
            [5, 10, 4],

            [3, 11, 7],
            [3, 2, 11],
            [2, 6, 11],
            [7, 11, 6],

            [0, 3, 12],
            [3, 7, 12],
            [7, 5, 12],
            [0, 12, 5],

            [5, 4, 13],
            [0, 5, 13],
            [4, 1, 13],
            [13, 1, 0],

            [4, 6, 8],
            [6, 2, 8],
            [2, 1, 8],
            [4, 8, 1],

            [9, 3, 0],
            [2, 3, 9],
            [1, 2, 9],
            [9, 0, 1]
        ],
        "minRange": 5,
        "maxRange": 23
    },
    {
        "id": 3,
        "name": "Hexaquisoctaedro",
        "vertices": [
            [ 24.864099502563477, 25.83740234375, 74.859399795532227],
            [ 24.864099502563477, 25.83740234375, 25.150299072265625],
            [ -24.844999313354492, 25.83740234375, 25.150299072265625],
            [ -24.844999313354492, 25.83740234375, 74.85939979553222],
            [ 24.864099502563477, -23.871700286865234, 25.150299072265625],
            [ 24.864099502563477, -23.871700286865234, 74.859399795532227],
            [ -24.864099502563477, -23.871700286865234, 74.859399795532227],
            [ -24.844999313354492, -23.871700286865234, 25.150299072265625],
            [ 0.0095914201810956, 50.69200134277344, 50.004805769771337509],
            [ 0.0095914201810956, 0.9828987121582, 99.71390151977539],
            [ 0.0095914201810956, 0.9828987121582, 0.29570007324219 ],
            [ -49.699501037597656, 0.9828987121582, 50.004805769771337509],
            [ 0.0095914201810956, -48.7262300252914429, 50.004805769771337509],
            [ 0.0095914201810956, 34.62480163574219, 16.36280059814453],
            [ -33.63240051269531, 34.62480163574219, 50.004805769771337509],
            [ 33.6515998840332, 34.62480163574219, 50.004805769771337509],
            [ -33.63240051269531, 0.973899841308594, 16.36280059814453],
            [ 0.0095914201810956, 34.62480163574219, 83.64680099487305],
            [ -33.63240051269531, 0.96699905395508, 83.64680099487305],
            [ 33.6515007019043, 0.96699905395508, 83.64680099487305],
            [ 33.6515007019043, 0.96699905395508, 16.36280059814453],
            [ 33.632999420166016, -32.655099868774414, 49.98231860063970089],
            [ 49.684898376464844, 0.99420166015625, 49.98231860063970089],
            [ 0.003157449886202812, -32.655099868774414, 16.34579849243164],
            [ 0.010789300315082073, -32.655099868774414, 83.643001556396484],
            [ -33.600799560546875, -32.655099868774414, 50.030482299625873566]
        ],
        "faces": [
            [13, 1, 10],
            [10, 1, 20],
            [10, 20, 4],
            [23, 10, 4],
            [7, 10, 23],
            [16, 10, 7],
            [2, 10, 16],
            [10, 2, 13],
    
            [20, 1, 22],
            [22, 1, 15],
            [15, 0, 22],
            [22, 0, 19],
            [22, 19, 5],
            [21, 22, 5],
            [4, 22, 21],
            [20, 22, 4],
    
            [2, 16, 11],
            [2, 11, 14],
            [3, 14, 11],
            [3, 11, 18],
            [11, 6, 18],
            [11, 25, 6],
            [11, 7, 25],
            [11, 16, 7],
    
            [0, 9, 19],
            [9, 5, 19],
            [9, 24, 5],
            [9, 6, 24],
            [9, 18, 6],
            [3, 18, 9],
            [3, 9, 17],
            [17, 9, 0],
    
            [1, 13, 8],
            [1, 8, 15],
            [8, 0, 15],
            [17, 0, 8],
            [8, 3, 17],
            [14, 3, 8],
            [14, 8, 2],
            [13, 2, 8],
    
            [6, 25, 12],
            [7, 12, 25],
            [7, 23, 12],
            [23, 4, 12],
            [4, 21, 12],
            [5, 12, 21],
            [5, 24, 12],
            [6, 12, 24]

        ],
        "minRange": 10,
        "maxRange": 47
    }
]