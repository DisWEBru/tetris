(function () {
    let dw = {}

    dw.colors = [
        'blue',
        'red',
        'green',
        'orange',
        'violet',
        'aquamarine',
        'grey'
    ]

    dw.figures = [
        { // Кубик
            turn: [
                [
                    [1,1],
                    [1,1]
                ],
                [
                    [1,1],
                    [1,1]
                ],
                [
                    [1,1],
                    [1,1]
                ],
                [
                    [1,1],
                    [1,1]
                ]
            ]
        },
        { // Палочка
            turn: [
                [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ],
                [
                    [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0]
                ],
                [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ],
                [
                    [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0],
                    [0,0,1,0]
                ]
            ]
        },
        { // левый Г
            turn: [
                [
                    [0,1,1],
                    [0,0,1],
                    [0,0,1]
                ],
                [
                    [0,0,1],
                    [1,1,1],
                    [0,0,0]
                ],
                [
                    [0,1,0],
                    [0,1,0],
                    [0,1,1]
                ],
                [
                    [1,1,1],
                    [1,0,0],
                    [0,0,0]
                ]
            ]
        },
        { // правый Г
            turn: [
                [
                    [0,1,1],
                    [0,1,0],
                    [0,1,0]
                ],
                [
                    [1,1,1],
                    [0,0,1],
                    [0,0,0]
                ],
                [
                    [0,0,1],
                    [0,0,1],
                    [0,1,1]
                ],
                [
                    [1,0,0],
                    [1,1,1],
                    [0,0,0]
                ]
            ]
        },
        { // левый Z
            turn: [
                [
                    [1,1,0],
                    [0,1,1],
                    [0,0,0]
                ],
                [
                    [0,0,1],
                    [0,1,1],
                    [0,1,0]
                ],
                [
                    [1,1,0],
                    [0,1,1],
                    [0,0,0]
                ],
                [
                    [0,0,1],
                    [0,1,1],
                    [0,1,0]
                ]
            ]
        },
        { // правый Z
            turn: [
                [
                    [0,1,1],
                    [1,1,0],
                    [0,0,0]
                ],
                [
                    [0,1,0],
                    [0,1,1],
                    [0,0,1]
                ],
                [
                    [0,1,1],
                    [1,1,0],
                    [0,0,0]
                ],
                [
                    [0,1,0],
                    [0,1,1],
                    [0,0,1]
                ]
            ]
        },
        { // T
            turn: [
                [
                    [1,1,1],
                    [0,1,0],
                    [0,0,0]
                ],
                [
                    [0,0,1],
                    [0,1,1],
                    [0,0,1]
                ],
                [
                    [0,1,0],
                    [1,1,1],
                    [0,0,0]
                ],
                [
                    [0,1,0],
                    [0,1,1],
                    [0,1,0]
                ]
            ]
        }
    ]

    dw.figure_now = {
        x: 0, // Фигура
        turn: 0, // Положение фигуры
        left: 0, // Фигура слева
        top: 0, // Фигура справа
        ar: [] // Элементы фигуры
    }

    dw.figure_next = {
        x: 0,
        turn: 0
    }

    dw.cube_ar = []

    dw.cube_count = 12
    dw.cube_count_height = dw.cube_count * 1.5
    dw.max_top = dw.cube_count_height - 1
    dw.move_time_start = 500

    dw.move_timeout = false

    dw.is_game = false

    /**
     * Случайное число от и до не включая последнее число
     * @param int начальное число
     * @param int конечное, которое не включается
     * @returns int
     */
    dw.getInterval = function (min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)

        return Math.floor(Math.random() * (max - min)) + min
    }

    dw.timer = function(callback, delay) {
        return new (function(callback, delay) {
            let timerId, start, remaining = delay;

            this.pause = function() {
                window.clearTimeout(timerId);
                timerId = null;
                remaining -= Date.now() - start;
            };

            this.resume = function() {
                if (timerId) {
                    return;
                }

                start = Date.now();
                timerId = window.setTimeout(callback, remaining);
            };

            this.resume();
        })(callback, delay)
    }

    dw.init = function () {
        document.body.addEventListener('keydown', function (e) {
            e = e || window.event;
            let direction

            if (e.keyCode == '32')
                direction = 'turn'
            else if (e.keyCode == '40')
                direction = 'down'
            else if (e.keyCode == '37')
                direction = 'left'
            else if (e.keyCode == '39')
                direction = 'right'
            else if (e.keyCode == '38') {
                dw.pause()
            } else
                return

            dw.turn(direction)
        })

        dw.place = document.body.querySelector('.game__place')

        dw.start_el = document.body.querySelector('.game__start-btn')

        dw.score_el = document.body.querySelector('.game__score')

        dw.level_el = document.body.querySelector('.game__level')

        dw.pause_el = document.body.querySelector('.game__pause')

        dw.pause_el.style.display = 'none'

        dw.start_el.addEventListener('click', function () {
            dw.start_el.style.display = 'none'

            dw.start()
        })

        dw.btn_pause = document.body.querySelector('.game__control-pause')

        dw.btn_pause.addEventListener('click', function () {
            dw.pause()
        })

        dw.btn_turn = document.body.querySelector('.game__control-turn i')

        dw.btn_turn.addEventListener('click', function () {
            dw.turn('turn')
        })

        dw.btn_down = document.body.querySelector('.game__control-down i')

        dw.btn_down.addEventListener('click', function () {
            dw.turn('down')
        })

        dw.btn_left = document.body.querySelector('.game__control-left i')

        dw.btn_left.addEventListener('click', function () {
            dw.turn('left')
        })

        dw.btn_right = document.body.querySelector('.game__control-right i')

        dw.btn_right.addEventListener('click', function () {
            dw.turn('right')
        })
    }

    dw.pause = function () {
        if (dw.is_game === false)
            return

        if (dw.is_pause === true) {
            console.log('Пауза выключена')

            dw.move_timeout.resume()

            dw.pause_el.style.display = 'none'
            dw.is_pause = false
        } else {
            console.log('Пауза включена')

            dw.move_timeout.pause()

            dw.pause_el.style.display = null
            dw.is_pause = true
        }
    }

    dw.turn = function (direction) {
        if (dw.is_game === false)
            return

        if (dw.is_pause === true)
            return

        if (direction == 'turn') {
            let turn_now = dw.figure_now.turn

            dw.figure_now.turn++

            if (dw.figure_now.turn > 3)
                dw.figure_now.turn = 0

            if (!dw.figureMove())
                dw.figure_now.turn = turn_now
        } else if (direction == 'right') {
            let left_now = dw.figure_now.left

            dw.figure_now.left++

            if (!dw.figureMove())
                dw.figure_now.left = left_now
        } else if (direction == 'left') {
            let left_now = dw.figure_now.left

            dw.figure_now.left--

            if (!dw.figureMove())
                dw.figure_now.left = left_now
        } else if (direction == 'down') {
            dw.figure_now.top++

            if (!dw.figureMove())
                dw.fell()
        }
    }

    dw.fell = function () {
        for (let i = 0; i < dw.figure_now.ar.length; i++) {
            if (dw.figure_now.ar[i].top < 0) {
                dw.gameOver()

                return
            }

            let cube = {
                top: dw.figure_now.ar[i].top,
                left: dw.figure_now.ar[i].left,
                el: dw.figure_now.ar[i].el
            }

            dw.cube_ar.push(cube)
        }

        while (true) {
            let count = {},
                is_true = false,
                count_remove = 0

            for (let i = 0; i < dw.cube_ar.length; i++) {
                if (count['k' + dw.cube_ar[i].top] == undefined) {
                    count['k' + dw.cube_ar[i].top] = {
                        top: dw.cube_ar[i].top,
                        list: []
                    }
                }

                count['k' + dw.cube_ar[i].top].list.push(i)
            }

            for (let k in count) {
                if (count[k].list.length >= dw.cube_count) {
                    for (let i = 0; i < count[k].list.length; i++) {
                        dw.cube_ar[count[k].list[i]].el.remove()
                        dw.cube_ar[count[k].list[i]].is_remove = true

                        for (let f = 0; f < dw.cube_ar.length; f++) {
                            if (dw.cube_ar[f].left != dw.cube_ar[count[k].list[i]].left)
                                continue

                            if (dw.cube_ar[f].top >= dw.cube_ar[count[k].list[i]].top)
                                continue

                            dw.cube_ar[f].top++

                            dw.cube_ar[f].el.style.top = (dw.cube_ar[f].top * dw.cube_height) + '%'
                        }
                    }

                    count_remove++

                    is_true = true
                }
            }

            if (is_true) {
                while (true) {
                    let is_while = false

                    for (let i = 0; i < dw.cube_ar.length; i++) {
                        if (dw.cube_ar[i].is_remove === true) {
                            dw.cube_ar.splice(i, 1)
                            is_while = true
                            console.log('Удален: ', i)
                            break
                        }
                    }

                    if (is_while === false)
                        break
                }

                let score = 10

                if (count_remove > 10) {
                    score = 20
                } else if (count_remove > 9) {
                    score = 19
                } else if (count_remove > 8) {
                    score = 18
                } else if (count_remove > 7) {
                    score = 17
                } else if (count_remove > 6) {
                    score = 16
                } else if (count_remove > 5) {
                    score = 15
                } else if (count_remove > 4) {
                    score = 14
                } else if (count_remove > 3) {
                    score = 13
                } else if (count_remove > 2) {
                    score = 12
                } else if (count_remove > 1) {
                    score = 11
                }

                dw.score = dw.score + (count_remove * score)

                dw.score_el.innerHTML = dw.score

                while (true) {
                    if ((dw.score / 100) > dw.level) {
                        dw.level++

                        dw.level_el.innerHTML = 'Lev: ' + dw.level

                        dw.move_time = dw.move_time * 0.95
                    } else {
                        break
                    }
                }
            } else {
                break
            }
        }

        dw.figureAdd()
    }

    dw.figureAdd = function () {
        if (dw.is_game === false)
            return

        if (dw.figure_now.ar.length > 0) {
            dw.figure_now.ar = []
        }

        dw.figure_now.x = dw.figure_next.x
        dw.figure_now.turn = dw.figure_next.turn
        dw.figure_now.left = dw.cube_count / 2
        dw.figure_now.top = -4

        let color = dw.colors[dw.getInterval(0, dw.colors.length)]

        for (let i = 0; i < dw.figures[dw.figure_now.x].turn[dw.figure_now.turn].length; i++) {
            for (let f = 0; f < dw.figures[dw.figure_now.x].turn[dw.figure_now.turn][i].length; f++) {
                if (dw.figures[dw.figure_now.x].turn[dw.figure_now.turn][i][f] == 1) {
                    let el = document.createElement('div')
                    el.className = 'game__cube--' + color

                    dw.place.append(el)

                    el.style.width = dw.cube_width + '%'
                    el.style.height = dw.cube_height + '%'

                    dw.figure_now.ar.push({
                        top: 0,
                        left: 0,
                        el: el
                    })
                }
            }
        }

        dw.figure_next.x = dw.getInterval(0, dw.figures.length)
        dw.figure_next.turn = dw.getInterval(0, 4)

        if (dw.figure_now.ar.length <= 0) {
            dw.is_game = false

            console.log('Ошибка добавления')

            return
        }

        dw.figureMove()

        console.log('Добавлен эелемент: ', dw.figure_now.x, dw.figure_now.turn)
    }

    dw.figureMove = function () {
        if (dw.is_game === false)
            return false

        let k = 0,
            is_false = false

        for (let i = 0; i < dw.figures[dw.figure_now.x].turn[dw.figure_now.turn].length; i++) {
            for (let f = 0; f < dw.figures[dw.figure_now.x].turn[dw.figure_now.turn][i].length; f++) {
                if (dw.figures[dw.figure_now.x].turn[dw.figure_now.turn][i][f] == 1) {
                    dw.figure_now.ar[k].top_back = dw.figure_now.ar[k].top
                    dw.figure_now.ar[k].left_back = dw.figure_now.ar[k].left
                    dw.figure_now.ar[k].back = true

                    dw.figure_now.ar[k].top = dw.figure_now.top + i
                    dw.figure_now.ar[k].left = dw.figure_now.left + f

                    if (dw.figure_now.ar[k].top >= dw.cube_count_height) {
                        is_false = true

                        break
                    }

                    if (dw.figure_now.ar[k].left >= dw.cube_count) {
                        is_false = true

                        break
                    }

                    if (dw.figure_now.ar[k].left < 0) {
                        is_false = true

                        break
                    }

                    for (let n = 0; n < dw.cube_ar.length; n++) {
                        if (dw.cube_ar[n].top == dw.figure_now.ar[k].top
                            && dw.cube_ar[n].left == dw.figure_now.ar[k].left) {
                            is_false = true

                            break
                        }
                    }

                    if (is_false)
                        break

                    k++
                }
            }

            if (is_false)
                break
        }

        if (is_false) {
            for (let i = 0; i < dw.figure_now.ar.length; i++) {
                if (dw.figure_now.ar[i].back === true) {
                    dw.figure_now.ar[i].top = dw.figure_now.ar[i].top_back
                    dw.figure_now.ar[i].left = dw.figure_now.ar[i].left_back
                }

                dw.figure_now.ar[i].back = false
            }

            return false
        }

        for (let i = 0; i < dw.figure_now.ar.length; i++) {
            dw.figure_now.ar[i].el.style.top = (dw.figure_now.ar[i].top * dw.cube_height) + '%'
            dw.figure_now.ar[i].el.style.left = (dw.figure_now.ar[i].left * dw.cube_width) + '%'
            dw.figure_now.ar[i].back = false
        }

        return true
    }

    dw.start = function () {
        if (dw.is_game === true)
            return

        dw.is_game = true

        dw.move_time = dw.move_time_start
        dw.cube_width = 100 / dw.cube_count
        dw.cube_height = dw.cube_width / 1.5

        dw.figure_next.x = dw.getInterval(0, dw.figures.length)
        dw.figure_next.turn = dw.getInterval(0, 4)

        dw.is_pause = false

        dw.score = 0

        dw.score_el.innerHTML = dw.score

        dw.level = 1

        dw.level_el.innerHTML = 'Lev: ' + dw.level

        dw.figureAdd()

        dw.move_timeout = dw.timer(function () {
            dw.move()
        }, dw.move_time)
    }

    dw.gameOver = function () {
        if (dw.cube_ar.length > 0) {
            for (let i = 0; i < dw.cube_ar.length; i++) {
                dw.cube_ar[i].el.remove()
            }

            dw.cube_ar = []
        }

        if (dw.figure_now.ar.length > 0) {
            for (let i = 0; i < dw.figure_now.ar.length; i++) {
                dw.figure_now.ar[i].el.remove()
            }

            dw.figure_now.ar = []
        }

        dw.start_el.style.display = null

        dw.is_game = false
    }

    dw.move = function () {
        if (dw.is_game === false)
            return

        dw.figure_now.top++

        if (!dw.figureMove())
            dw.fell()

        dw.move_timeout = dw.timer(function () {
            dw.move()
        }, dw.move_time)
    }

    dw.init()
})()