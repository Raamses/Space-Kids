export const PLANET_ASSETS = {
    sun: {
        map: '/textures/2k_sun.jpg',
        // In a full implementation, we would have emissiveMap, etc.
    },
    mercury: {
        map: '/textures/2k_mercury.jpg',
    },
    venus: {
        map: '/textures/2k_venus_surface.jpg',
        // Venus atmosphere is opaque, so we often just use the surface or atmosphere texture
        atmosphere: '/textures/2k_venus_atmosphere.jpg',
    },
    earth: {
        map: '/textures/2k_earth_daymap.jpg',
        normalMap: '/textures/2k_earth_normal_map.jpg',
        specularMap: '/textures/2k_earth_specular_map.jpg',
        cloudsMap: '/textures/2k_earth_clouds.jpg',
    },
    moon: {
        map: '/textures/2k_moon.jpg',
    },
    mars: {
        map: '/textures/2k_mars.jpg',
        normalMap: '/textures/2k_mars_normal_map.png',
    },
    jupiter: {
        map: '/textures/2k_jupiter.jpg',
    },
    saturn: {
        map: '/textures/2k_saturn.jpg',
        ringMap: '/textures/2k_saturn_ring_alpha.png',
    },
    uranus: {
        map: '/textures/2k_uranus.jpg',
        ringMap: '/textures/2k_uranus_ring_alpha.png',
    },
    neptune: {
        map: '/textures/2k_neptune.jpg',
    }
};

export const COSMOS_ASSETS = {
    galaxySkybox: '/textures/2k_stars_milky_way.jpg', // Confirmed filename
};
