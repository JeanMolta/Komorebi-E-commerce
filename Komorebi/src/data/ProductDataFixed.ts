import type { Product } from './ProductTypes'; 

export const productsData: Product[] = [
    { 
        id: "prod_001", 
        image: "https://www.eatwithcarmen.com/wp-content/uploads/2024/02/salmon-onigiri-recipe.jpg",
        imageUrl: "https://www.eatwithcarmen.com/wp-content/uploads/2024/02/salmon-onigiri-recipe.jpg",
        name: "Onigiri de Salmón", 
        vendor: "Sakura Onigiri Co.", 
        price: 15000,
        category: "onigiris" 
    },
    { 
        id: "prod_002", 
        image: "https://www.blogexquisit.es/wp-content/uploads/onigiri-con-atun.jpg",
        imageUrl: "https://www.blogexquisit.es/wp-content/uploads/onigiri-con-atun.jpg",
        name: "Onigiri de Atún Picante", 
        vendor: "Sakura Onigiri Co.", 
        price: 16000,
        category: "onigiris" 
    },
    { 
        id: "prod_003", 
        image: "https://chefjacooks.com/wp-content/uploads/2022/09/ume-onigiri-square.jpg",
        imageUrl: "https://chefjacooks.com/wp-content/uploads/2022/09/ume-onigiri-square.jpg",
        name: "Onigiri de Umeboshi (Ciruela ácida japonesa)", 
        vendor: "ZenRice Snacks", 
        price: 14500,
        category: "onigiris" 
    },
    { 
        id: "prod_019", 
        image: "/images/products/ramen.jpg",
        imageUrl: "/images/products/ramen.jpg",
        name: "Ramen Instantáneo Premium", 
        vendor: "Nissin Japonés", 
        price: 10500,
        category: "onigiris" 
    },
    { 
        id: "prod_004", 
        image: "/images/products/mochi.jpg",
        imageUrl: "/images/products/mochi.jpg",
        name: "Mochi de Té Verde", 
        vendor: "Mochi Mágico", 
        price: 8000,
        category: "sweettreats" 
    },
    { 
        id: "prod_005", 
        image: "/images/products/pocky.jpg",
        imageUrl: "/images/products/pocky.jpg",
        name: "Pocky Chocolate", 
        vendor: "Glico International", 
        price: 7000,
        category: "sweettreats" 
    },
    { 
        id: "prod_006", 
        image: "/images/products/kitkat-matcha.jpg",
        imageUrl: "/images/products/kitkat-matcha.jpg",
        name: "KitKat Té Matcha", 
        vendor: "Nestlé Japón", 
        price: 9000,
        category: "sweettreats" 
    },
    { 
        id: "prod_007", 
        image: "/images/products/dorayaki.jpg",
        imageUrl: "/images/products/dorayaki.jpg",
        name: "Dorayaki con Frijol Rojo", 
        vendor: "Dora Snacks", 
        price: 11000,
        category: "sweettreats" 
    },
    { 
        id: "prod_008", 
        image: "/images/products/hersheys.jpg",
        imageUrl: "/images/products/hersheys.jpg",
        name: "Chocolate Hershey's Classic", 
        vendor: "Hershey's Colombia", 
        price: 6000,
        category: "sweettreats" 
    },
    { 
        id: "prod_009", 
        image: "/images/products/twix.jpg",
        imageUrl: "/images/products/twix.jpg",
        name: "Twix Caramelo", 
        vendor: "Mars International", 
        price: 6500,
        category: "sweettreats" 
    },
    { 
        id: "prod_010", 
        image: "/images/products/kitkat-dark.jpg",
        imageUrl: "/images/products/kitkat-dark.jpg",
        name: "KitKat Negro", 
        vendor: "Nestlé Internacional", 
        price: 8800,
        category: "sweettreats" 
    },
    { 
        id: "prod_011", 
        image: "/images/products/haribo.jpg",
        imageUrl: "/images/products/haribo.jpg",
        name: "Haribo Ositos", 
        vendor: "Haribo Global", 
        price: 7500,
        category: "sweettreats" 
    },
    { 
        id: "prod_016", 
        image: "/images/products/biscoff.jpg",
        imageUrl: "/images/products/biscoff.jpg",
        name: "Biscoff Cookies", 
        vendor: "Lotus Biscoff", 
        price: 13000,
        category: "sweettreats" 
    },
    { 
        id: "prod_017", 
        image: "/images/products/kinder-bueno.jpg",
        imageUrl: "/images/products/kinder-bueno.jpg",
        name: "Kinder Bueno", 
        vendor: "Ferrero", 
        price: 12000,
        category: "sweettreats" 
    },
    { 
        id: "prod_018", 
        image: "/images/products/twix-white.jpg",
        imageUrl: "/images/products/twix-white.jpg",
        name: "Twix Blanco", 
        vendor: "Mars Internacional", 
        price: 9000,
        category: "sweettreats" 
    },
    { 
        id: "prod_020", 
        image: "/images/products/oreo.jpg",
        imageUrl: "/images/products/oreo.jpg",
        name: "Galletas Oreo Doble Crema", 
        vendor: "Mondelez", 
        price: 6800,
        category: "sweettreats" 
    },
    { 
        id: "prod_014", 
        image: "/images/products/chocoramo.jpg",
        imageUrl: "/images/products/chocoramo.jpg",
        name: "Chocoramo Mini", 
        vendor: "Productos Ramo", 
        price: 4200,
        category: "cakes" 
    },
    { 
        id: "prod_012", 
        image: "/images/products/lays.jpg",
        imageUrl: "/images/products/lays.jpg",
        name: "Lays Papas Clásicas", 
        vendor: "PepsiCo Snacks", 
        price: 6400,
        category: "healthy" 
    },
    { 
        id: "prod_013", 
        image: "/images/products/cheetos.jpg",
        imageUrl: "/images/products/cheetos.jpg",
        name: "Cheetos Flamin' Hot", 
        vendor: "PepsiCo Snacks", 
        price: 7000,
        category: "healthy" 
    },
    { 
        id: "prod_015", 
        image: "/images/products/takis.jpg",
        imageUrl: "/images/products/takis.jpg",
        name: "Takis Fuego", 
        vendor: "Barcel Internacional", 
        price: 9500,
        category: "healthy" 
    },
];

export const mockProducts = productsData;