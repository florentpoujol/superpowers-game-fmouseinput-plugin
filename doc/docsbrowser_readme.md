# Superpowers docs browser plugin

This plugin brings a "Docs browser" tool that lets you browse documentation exposed by any other plugins you have installed.

It works pretty much like the "Typescript API browser" tool that easily gives you acces to any plugins' Typescript API.

For [Superpowers, the extensible HTML5 2D+3D game engine](http://sparklinlabs.com).

## Installation

[Download the latest release](https://github.com/florentpoujol/superpowers-docsbrowser-plugin/releases), unzip it, rename the folder to `docsbrowser`, move it inside `app/plugins/florentpoujol/` then restart your server.

__Advanced:__

Get it via `npm`:

    npm install sup-docsbrowser-plugin

The name of the vendors or plugins in the `app/plugins/` folder don't matter.  
So you can leave the plugin path as `node_modules/sup-docsbrowser-plugin`.

## Exposing documentation from your plugin

Just have a `public/docs` folder in your plugin's folder with at least an `index.html` file in it.

Using a `manifest.json` file in the `public/docs` folder, you can set a plugin name and a vendor name and URL to be used in the navigation menu instead of the folder's names.  

Ie:

    {
      "pluginName": "dat.GUI",
      "vendorName": "Florent Poujol",
      "vendorUrl": "https://github.com/florentpoujol"
    }
