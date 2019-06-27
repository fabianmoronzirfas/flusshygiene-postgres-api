# Lab Notes during dev

## Migration

1. Do the changes on your entities
2. generate the migration file
3. !Review the generated migration. Don't trust the changes applied.
4. Generate the JS from it (`npm run build`)
5. Test them on the development version of the DB
6. Make sure you get the right thing
7. Make a backup of the DB you could restore
8. Run them on the production (and cross your fingers)

Generate Migration File

!Hint: these commands are for fish shell. `Bash` is slightly different (`NODE_ENV=development` without the `env`).

```fish
env NODE_DOCKER_ENV=0 env NODE_ENV=development npm run typeorm migration:generate -- --name SpotMesaurementsEcoEnte
```

Run the migration

```fish
env NODE_DOCKER_ENV=0 env NODE_ENV=development npm run typeorm migration:run
```

Revert the migration

```fish
env NODE_DOCKER_ENV=0 env NODE_ENV=development npm run typeorm migration:revert
```


See the following links:

- https://typeorm.io/#/using-cli/if-entities-files-are-in-typescript
- https://typeorm.io/#/migrations/generating-migrations



Tablles

Topic: Rohdaten Tabelle
=======================

> WICHTIG ist zu bedenken, dass alle Variable, also rain, Q, GI, purification plant ihre eigene ganz persönliche Date, und Datetime Spalte haben, da die zeitliche Auflösung teilweise unterschiedlich ist.

Hm. Dann sollten wir vielleicht pro Type eine eigene Tabelle führen

also

One To Many Batingspot -> rain
One To Many Batingspot -> discharges
One To Many Batingspot -> globalIrradiances

One To Many Batingspot -> purificationPlantsMeasurements
One To Many Batingspot -> UserInputsMeasurements


Tabelle "rain", "discharges", "globalIrradiances",

id
cratedAt
UpdatedAt
time
date
value -> number

Tabelle "purificationPlantsMeasurements" , "UserInputsMeasurements":

id
cratedAt
UpdatedAt
time
date
value -> number
plantId oder userInPutId -> Type PurificationPlant oder UserInput

PurificationPlant, UserInput
id
name?
location?
cratedAt
UpdatedAt


Topic Modelle Pro Badestelle
============================

> 4. Tabelle mit „Modellen“ pro Badestelle und der Info welches Modell zu Vorhersage genutzt wird. Wir fitten mehrere Modelle pro Badestelle, es sollen alle gespeichert werden. (es handelt sich um eine R-objekt) (liste mit Modellen drin) Spalte „Models“. Wahrscheinlich kann man die auch als Text abspeichern


Also:


One to Many Bathingspot -> BathingspotModels

Tabelle BathingspotModels

id
cratedAt
UpdatedAt
rmodel -> string



