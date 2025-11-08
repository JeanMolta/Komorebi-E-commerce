import type { Product } from './ProductTypes'; 


export interface ProductWithCategory extends Product {
    category: string;
}

export const productsData: ProductWithCategory[] = [
    { 
        id: "prod_001", 
        imageUrl: "https://www.eatwithcarmen.com/wp-content/uploads/2024/02/salmon-onigiri-recipe.jpg",
        name: "Onigiri de Salmón", 
        vendor: "Sakura Onigiri Co.", 
        price: 15000,
        category: "onigiris" 
    },
    { 
        id: "prod_002", 
        imageUrl: "https://www.blogexquisit.es/wp-content/uploads/onigiri-con-atun.jpg",
        name: "Onigiri de Atún Picante", 
        vendor: "Sakura Onigiri Co.", 
        price: 16000,
        category: "onigiris" 
    },
    { 
        id: "prod_003", 
        imageUrl: "https://chefjacooks.com/wp-content/uploads/2022/09/ume-onigiri-square.jpg",
        name: "Onigiri de Umeboshi (Ciruela ácida japonesa)", 
        vendor: "ZenRice Snacks", 
        price: 14500,
        category: "onigiris" 
    },
    { 
        id: "prod_019", 
        imageUrl: "af",
        name: "Ramen Instantáneo Premium", 
        vendor: "Nissin Japonés", 
        price: 10500,
        category: "onigiris" 
    },

    { 
        id: "prod_004", 
        imageUrl: "WA",
        name: "Mochi de Té Verde", 
        vendor: "Mochi Mágico", 
        price: 8000,
        category: "sweettreats" 
    },
    { 
        id: "prod_005", 
        imageUrl: "W",
        name: "Pocky Chocolate", 
        vendor: "Glico International", 
        price: 7000,
        category: "sweettreats" 
    },
    { 
        id: "prod_006", 
        imageUrl: "A",
        name: "KitKat Té Matcha", 
        vendor: "Nestlé Japón", 
        price: 9000,
        category: "sweettreats" 
    },
    { 
        id: "prod_007", 
        imageUrl: "wa",
        name: "Dorayaki con Frijol Rojo", 
        vendor: "Dora Snacks", 
        price: 11000,
        category: "sweettreats" 
    },
    { 
        id: "prod_008", 
        imageUrl: "wi",
        name: "Chocolate Hershey’s Classic", 
        vendor: "Hershey’s Colombia", 
        price: 6000,
        category: "sweettreats" 
    },
    { 
        id: "prod_009", 
        imageUrl: "wa",
        name: "Twix Caramelo", 
        vendor: "Mars International", 
        price: 6500,
        category: "sweettreats" 
    },
    { 
        id: "prod_010", 
        imageUrl: "mi",
        name: "KitKat Negro", 
        vendor: "Nestlé Internacional", 
        price: 8800,
        category: "sweettreats" 
    },
    { 
        id: "prod_011", 
        imageUrl: "iwjda",
        name: "Haribo Ositos", 
        vendor: "Haribo Global", 
        price: 7500,
        category: "sweettreats" 
    },
    { 
        id: "prod_016", 
        imageUrl: "asd",
        name: "Biscoff Cookies", 
        vendor: "Lotus Biscoff", 
        price: 13000,
        category: "sweettreats" 
    },
    { 
        id: "prod_017", 
        imageUrl: "wad",
        name: "Kinder Bueno", 
        vendor: "Ferrero", 
        price: 12000,
        category: "sweettreats" 
    },
    { 
        id: "prod_018", 
        imageUrl: "ad",
        name: "Twix Blanco", 
        vendor: "Mars Internacional", 
        price: 9000,
        category: "sweettreats" 
    },
    { 
        id: "prod_020", 
        imageUrl: "ads",
        name: "Galletas Oreo Doble Crema", 
        vendor: "Mondelez", 
        price: 6800,
        category: "sweettreats" 
    },

  
    { 
        id: "prod_014", 
        imageUrl: "a",
        name: "Chocoramo Mini", 
        vendor: "Productos Ramo", 
        price: 4200,
        category: "cakes" 
    },
    
    { 
        id: "prod_012", 
        imageUrl: "wa",
        name: "Lays Papas Clásicas", 
        vendor: "PepsiCo Snacks", 
        price: 6400,
        category: "healthy" 
    },
    { 
        id: "prod_013", 
        imageUrl: "wa",
        name: "Cheetos Flamin’ Hot", 
        vendor: "PepsiCo Snacks", 
        price: 7000,
        category: "healthy" 
    },
    { 
        id: "prod_015", 
        imageUrl: "sa",
        name: "Takis Fuego", 
        vendor: "Barcel Internacional", 
        price: 9500,
        category: "healthy" 
    },
];

export const mockProducts = productsData;