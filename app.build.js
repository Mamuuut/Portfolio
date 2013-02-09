({
    appDir: 'www',
    baseUrl: 'js',
    paths: {
        canvas: '../canvas'
    },
    dir: 'www-built',
    modules: [
        {
            name: "app/main",
            include: [
            	'canvas/js/utils'
            ]
        }
    ]
})
