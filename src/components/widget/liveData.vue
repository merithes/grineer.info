<template>
  <div id="liveData">
    <q-tabs
      v-model="dataTab"
      narrow-indicator
      content-class="bg-thin-bright-overlay border-gray q-mx-md"
      indicator-color="primary"
    >
      <q-tab name="pc" label="PC"/>
      <q-tab name="ps" label="PS"/>
      <q-tab name="xb" label="XBX"/>
      <q-tab name="ni" label="NSW"/>
    </q-tabs>
    <q-tab-panels v-model="dataTab" animated class="bg-transparent">
      <q-tab-panel v-for="platform of Object.keys(liveDataPlatforms)" :key="platform" :name="platform">
        <div
          v-if="Object.keys(liveDataPlatforms[platform]).length === 0 || (pcTimeStamp + 60 * 60 < Math.floor(Date.now() / 1000))"
        >
          <div class="row justify-center q-mb-lg q-mt-md">
            <q-skeleton type="rect" width="16ch" animation="pulse-x" height="1.5em"/>
          </div>
          <q-skeleton type="rect" square height="6.2em" class="border-gray"/>
          <div class="row justify-center q-mb-lg q-pt-xs q-mt-lg">
            <q-skeleton type="rect" width="16ch" animation="pulse-x" height="1.5em"/>
          </div>
          <q-skeleton type="rect" square height="13.8em" class="border-gray"/>
          <div class="row justify-center q-mb-lg q-pt-xs q-mt-lg">
            <q-skeleton type="rect" width="16ch" animation="pulse-x" height="1.5em"/>
          </div>
          <q-skeleton type="rect" square height="17.5em" class="border-gray"/>
          <div class="row justify-center q-mb-lg q-pt-xs q-mt-lg">
            <q-skeleton type="rect" width="16ch" animation="pulse-x" height="1.5em"/>
          </div>
          <div class="row q-col-gutter-y-sm">
            <div v-for="item of [1,2,3]" :key="item" class="col-xs-12">
              <q-skeleton type="rect" square height="7.3em" class="col-xs-12 border-gray"/>
            </div>
          </div>
        </div>
        <div v-else>
          <!-- WORLD EVENT BLOCK START -->

          <div class="text-h6 michroma text-center q-mb-md q-mt-sm" v-if="Array.isArray(liveDataPlatforms[platform].events) && liveDataPlatforms[platform].events.length">
            Events
          </div>
          <div v-if="Array.isArray(liveDataPlatforms[platform].events) && liveDataPlatforms[platform].events.length">
            <template
              v-for="(event, index) in liveDataPlatforms[platform].events"
            >
              <div
                v-if="event.active && !event.expired"
                :key="event.id"
                class="row relative-position"
                :class="{
                  'q-mt-lg': index !== 0
                }"
              >
                <div class="col-xs-12 q-px-md relative-position border-gray bg-light-bright-overlay q-pa-md">
                  <div class="small-line q-mb-sm">
                    <span
                      v-if="typeof event.description === 'string' && event.description.length"
                      class="text-weight-normal text-subtitle1 small-line block-underline q-pb-xs"
                    >
                      {{event.description + "&nbsp;&nbsp;"}}
                    </span>
                    <span v-if="typeof event.victimNode === 'string' && event.victimNode.length && typeof event.description === 'string' && event.description.length"> - </span>
                    <span
                      v-if="typeof event.victimNode === 'string' && event.victimNode.length"
                      class="text-subtitle2 small-line"
                    >
                      {{event.victimNode}}
                    </span>
                  </div>
                  <div class="text-caption q-mt-xs" v-if="typeof event.tooltip === 'string' && event.tooltip.length && event.description !== event.tooltip" height="2em">
                    {{event.tooltip}}
                  </div>
                  <q-list class="text-caption q-mt-xs q-mb-sm" v-else-if="Array.isArray(event.rewards) && event.rewards.length">
                    <template v-for="(reward, index) in event.rewards">
                      <q-item
                        v-if="typeof reward.asString === 'string' && reward.asString.length"
                        :key="'reward_'+index"
                        class="items-center"
                      >
                        <q-item-section
                          v-if="typeof reward.thumbnail === 'string' && reward.thumbnail.length"
                          avatar
                        >
                          <q-img
                            :src="reward.thumbnail"
                            ratio="1"
                            width="2rem"
                            contain
                          />
                        </q-item-section>
                        <q-item-label>
                          {{reward.asString}}
                        </q-item-label>
                      </q-item>
                    </template>
                  </q-list>

                  <div class="q-mt-md text-center courier-prime">
                    <!-- <VueCountdownTimer
                      :start-time="event.activation"
                      :end-time="event.expiry"
                      :interval="1000"
                    /> -->
                    <countdown :end-time="new Date(event.expiry).getTime()" :speed="25">
                      <template
                        v-slot:process="time"
                      >
                        <span>
                          Ends in {{
                            (time.timeObj.d > 0 ? (`${time.timeObj.d}`).padStart(2, '0') + 'd ' : '')+
                            (`${time.timeObj.h}`).padStart(2, '0') + ':' +
                            (`${time.timeObj.m}`).padStart(2, '0') + ':' +
                            (`${time.timeObj.s}`).padStart(2, '0') + '.' +
                            (`${time.timeObj.ms}`).padStart(2, '0').substr(0, 2)
                          }}
                        </span>
                      </template>
                      <template v-slot:finish>
                        <span class="courier-prime">
                          The event is now over.
                        </span>
                      </template>
                    </countdown>
                    <q-linear-progress
                      v-if="typeof event.health !== 'undefined' && event.health !== null && event.health !== 0"
                      :value="event.health/100"
                      color="primary"
                      class="q-mt-xs"
                      size="1em"
                    >
                      <div class="absolute-full flex flex-center">
                        <q-badge text-color="white" class="text-sm small-line q-pa-none q-ma-none full-width justify-center" :label="event.health+'%'" color="transparent"/>
                      </div>
                    </q-linear-progress>
                  </div>
                  <q-badge
                    v-if="typeof event.faction !== 'undefined' && event.faction.length" color="orange-8"
                    :label="event.faction"
                    class="absolute-top-right q-mr-md q-mt-md"
                  />
                  <q-badge
                    v-else-if="typeof event.affiliatedWith !== 'undefined' && event.affiliatedWith.length" color="light-green-9"
                    :label="event.affiliatedWith"
                    class="absolute-top-right q-mr-md q-mt-md"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- SORTIE BLOCK START -->

          <div class="text-h6 michroma text-center q-mb-md q-mt-lg" v-if="typeof liveDataPlatforms[platform].sortie === 'object'">
            Sortie
          </div>
          <div v-if="typeof liveDataPlatforms[platform].sortie === 'object'" class="relative-position">
            <div class="border-gray bg-light-bright-overlay q-px-md">
              <span
                v-if="typeof liveDataPlatforms[platform].sortie.faction !== 'undefined' && liveDataPlatforms[platform].sortie.faction.length" color="orange-8"
                :label="liveDataPlatforms[platform].sortie.faction"
                class="q-pr-md q-pb-xs q-ml-md block-underline inline-block q-pa-md"
              >
                <span v-if="typeof liveDataPlatforms[platform].sortie.boss !== 'undefined' && liveDataPlatforms[platform].sortie.boss.length" class="text-subtitle-1 q-mr-xs" >{{ liveDataPlatforms[platform].sortie.boss }}</span> - <q-badge class="q-ml-xs" :label="liveDataPlatforms[platform].sortie.faction"/>
              </span>
              <q-carousel
                v-model="sortieSlideFirst"
                transition-prev="jump-down"
                transition-next="jump-up"
                vertical
                swipeable
                animated
                control-color="accent"
                navigation
                navigation-position="left"
                padding
                infinite
                :autoplay="!pausedSortieSlide ? autoPlaySortieDuration : false"
                @transition="pausedSortieSlide = false"
                height="10em"
                class="bg-transparent text-white no-border-radius no-padding q-mt-sm"
              >
                <q-carousel-slide
                  v-for="(step, index) in liveDataPlatforms[platform].sortie.variants"
                  :name="index"
                  :key="'sortie_'+index"
                  class=""
                >
                  <div
                    class="full-height"
                    @click="toggleSortieSlide(true)"
                  >
                    <div class="col-xs-12 text-weight-medium text-subtitle2 small-line text-left q-mb-sm q-mt-sm courier-prime">
                      <span>{{step.node.replace(/([^\(]+) \(([^\)]+)\)/iu, "$1, $2")}}</span>: <span>{{step.missionType}}</span>
                    </div>
                    <div class="col-xs-12">
                      <div class="q-ml-xs text-caption small-line">{{step.modifier.split(":").pop()}}</div>
                    </div>
                    <div
                      class="col-xs-12 no-wrap"
                    >
                      <q-separator spaced/>
                      <div class="q-ml-xs text-caption text-weight-light small-line">
                        {{ step.modifierDescription }}
                      </div>
                    </div>
                  </div>
                </q-carousel-slide>
                <template v-slot:navigation-icon="{ active, btnProps, onClick }">
                  <q-btn
                    size="sm"
                    :icon="active ? !pausedSortieSlide  ? 'stop' : 'pause' : 'stop'"
                    class="no-margin no-padding"
                    :color="active ? pausedSortieSlide ? 'primary' : 'accent' : 'white'"
                    :class="{'rotate-45':  active && !pausedSortieSlide, 't-fast-ease': true}"
                    flat
                    round
                    dense
                    @click="onClick();toggleSortieSlide(active)"
                  />
                </template>
              </q-carousel>
            </div>
          </div>

          <!-- FISSURES BLOCK START -->

          <div class="text-h6 michroma text-center q-mb-md q-mt-lg" v-if="Array.isArray(liveDataPlatforms[platform].fissures)">
            Fissures
          </div>
          <div
            v-if="Array.isArray(liveDataPlatforms[platform].fissures) && liveDataPlatforms[platform].fissures.length && liveDataPlatforms[platform].fissures.filter((fissure) => fissure.active).length"
          >
            <q-list
              bordered
              separator
              class="border-grey bg-light-bright-overlay"
            >
              <q-expansion-item
                v-for="(fissure, index) in formatFissures(liveDataPlatforms[platform].fissures)"
                :key="index"
                group="relics"
              >
                <template v-slot:header>
                  <div class="full-width row items-center">
                    <q-icon
                      :name="`img:images/RELIC.${fissure.name.toUpperCase()}_WHITE.svg`"
                      size="2em"
                      class="q-mr-sm drop-shadow-3"
                    />
                    <span class="courier-prime">
                      {{ fissure.name }}
                    </span>
                  </div>
                </template>
                <q-separator />
                <q-list
                  separator
                >
                  <q-item
                    v-for="(node, index) in fissure.nodes"
                    :key="index"
                    v-if="Date.now() < new Date(node.expiry).getTime()"
                    class="bg-med-dark-overlay row items-center"
                  >
                    <q-item-section
                      class="col-xs-2 col-md-1 items-center drop-shadow-3"
                    >
                      <q-icon :name="`img:images/${node.enemyKey.toUpperCase()}_WHITE.svg`" size="1.5rem"/>
                      <q-tooltip content-class="bg-dark border-gray drop-shadow-3 no-border-radius small-line q-pb-xs q-pt-sm q-px-sm courier-prime text-caption">
                        {{ node.enemy }}
                      </q-tooltip>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ node.name }}</q-item-label>
                      <q-item-label caption>
                        <countdown
                          :end-time="new Date(node.expiry).getTime()"
                          :speed="1000"
                          @finish="node.show = false"
                        >
                          <template
                            v-slot:process="time"
                          >
                            <span
                              class="inconsolata"
                            >
                              Ends in {{
                                (time.timeObj.d > 0 ? (`${time.timeObj.d}`).padStart(2, '0') + 'd ' : '')+
                                ( time.timeObj.h > 0 ? parseInt(time.timeObj.h) + 'h ' : '') +
                                (time.timeObj.m > 0 ? (`${time.timeObj.m}`).padStart(2, '0')  + 'm ' : '' ) +
                                (`${time.timeObj.s}`).padStart(2, '0') + 's'
                              }}
                            </span>
                          </template>
                          <template v-slot:finish>
                            <span class="courier-prime">
                              Fissure is now closed
                            </span>
                          </template>
                        </countdown>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>
          </div>
          <!-- INVASIONS BLOCK START -->

          <div class="text-h6 michroma text-center q-mb-md q-mt-lg" v-if="Array.isArray(liveDataPlatforms[platform].invasions) && liveDataPlatforms[platform].invasions.length">
            Invasions
          </div>
          <div class="row q-col-gutter-y-sm" v-if="Array.isArray(liveDataPlatforms[platform].invasions) && liveDataPlatforms[platform].invasions.filter(function (invasion) {return !invasion.completed && invasion.eta !== 'Infinityd'}).length">
            <template
              v-for="(factionInvasion, invasionName) in formatInvasions(liveDataPlatforms[platform].invasions)"
            >
            <div
              v-for="(planetInvasion, planetName) in factionInvasion"
              :key="invasionName+planetName"
              class="col-xs-12"
            >
              <q-expansion-item
                class="bg-light-bright-overlay border-gray tgi-invasion-item q-px-md"
                @show="planetInvasion.expanded = true"
                @hide="planetInvasion.expanded = false"
                group="invasions"
              >
                <template
                  v-slot:header
                >
                  <div class="row full-width q-pt-md q-pb-xs">
                    <div class="col-xs-12">
                      <span>{{invasionName}} - {{planetName}}</span>
                    </div>
                    <div class="col-xs-12 q-mt-xs" style="height: .7em">
                      <q-linear-progress
                        class="linear-progress-opaque shadow-1"
                        :color="getFactionColor(planetInvasion.attackerKey)"
                        :track-color="getFactionColor(planetInvasion.defenderKey)"
                        :value="Math.ceil(planetInvasion.completion) / 100"
                        size=".7em"
                      />
                    </div>
                    <div class="col-xs-6 text-center text-caption">
                      {{planetInvasion.attackingFaction}} {{ new Intl.NumberFormat("en-GB", {maximumFractionDigits: 1, minimumFractionDigits: 1}).format(Math.round(planetInvasion.completion * 10) / 10) }}%
                    </div>
                    <div v-if="typeof planetInvasion.defendingFaction !== 'undefined' && planetInvasion.defendingFaction.length && planetInvasion.defendingFaction !== planetInvasion.attackingFaction" class="col-xs-6 text-center text-caption">
                      {{planetInvasion.defendingFaction}} {{ new Intl.NumberFormat("en-GB", {maximumFractionDigits: 1, minimumFractionDigits: 1}).format(100 - Math.round(planetInvasion.completion * 10) / 10) }}%
                    </div>
                    <div class="col-xs-12 row justify-center">
                      <q-icon
                        name="keyboard_arrow_down"
                        class="t-normal-ease small-line"
                        size="1.7rem"
                        :class="{
                          'rotate-180': planetInvasion.expanded
                        }"
                      />
                    </div>
                  </div>
                </template>
                <div class="invasion-infos-body t-normal-ease">
                  <div class="row q-pb-md q-col-gutter-x-lg">
                    <div
                      v-for="(node, index) in planetInvasion.nodes"
                      :key="index"
                      class="col-xs-6"
                    >
                      <div class="row">
                        <div class="col-xs-12 text-center">
                          {{ node.nodeKey.replace(/([^\(]+).*/iu, "$1").trim() }}
                        </div>
                        <div class="col-xs-12">
                          <q-linear-progress
                          class="linear-progress-opaque shadow-1"
                          :color="getFactionColor(node.attacker.factionKey)"
                          :track-color="getFactionColor(node.defender.factionKey)"
                          :value="Math.ceil(node.completion) / 100"
                          />
                        </div>
                        <div class="col-xs-6 text-left q-pl-xs q-mt-xs">
                          <div v-if="typeof node.attackerReward === 'object' && node.attackerReward.itemString.length" class="small-line">
                              <span class="text-sm">{{node.attackerReward.asString}}</span>
                          </div>
                        </div>
                        <div class="col-xs-6 text-right q-pr-xs q-mt-xs">
                          <div v-if="typeof node.defenderReward === 'object' && node.defenderReward.itemString.length" class="small-line">
                              <span class="text-sm">{{node.defenderReward.asString}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </div>
            </template>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'liveData',
    components: {},
    data () {
      return {
        sortieSlideFirst: 0,
        autoPlaySortieDuration: 10 * 1000,
        pausedSortieSlide: false,
        dataTab: "pc"
      }
    },
    computed: {
      liveDataPlatforms() {
        return {
          pc: this.$store.state.liveDataStore.fullPcData,
          ps: this.$store.state.liveDataStore.fullPsData,
          xb: this.$store.state.liveDataStore.fullXbData,
          ni: this.$store.state.liveDataStore.fullNiData,
        }
      },
      pcTimeStamp() {
        return this.$store.state.liveDataStore.pcDataTimestamp
      }
    },
    props: {
  	},
    methods: {
      formatFissures: function (fissures) {
        let formattedFissures = {}
        fissures.filter( (fissure) => fissure.active )
        for (let fissure of fissures) {
          if (typeof formattedFissures[fissure.tierNum] === 'undefined') {
            formattedFissures[fissure.tierNum] = {
              name: fissure.tier,
              shown: true,
              nodes: []
            }
          }
          formattedFissures[fissure.tierNum].nodes.push({
            name: fissure.node.replace(/[^\(]+\(([^\)]+)\)/iu, "$1") + " - " + fissure.node.replace(/([^\(]+ )\([^\)]+\)/iu, "$1").trim(),
            enemyKey: fissure.enemyKey,
            enemy: fissure.enemy,
            expiry: fissure.expiry,
            type: fissure.Interception,
            shown: true
          })
        }
        return formattedFissures
      },
      formatInvasions: function(invasions) {
        let formattedInvasions = {}
        invasions.forEach(function(element){
          if (!element.completed && element.eta !== 'Infinityd') {
            let planetName = element.node.replace(/[^\(]+\(([^\)]+)\)/iu, "$1")
            let invasionName = element.desc;
            if (element.attacker.factionKey === 'Infested') {
              invasionName = 'Infested Outbreak';
            }
            if (typeof formattedInvasions[invasionName] === 'undefined') {
              formattedInvasions[invasionName] = {}
            }
            if (typeof formattedInvasions[invasionName][planetName] === 'undefined') {
              formattedInvasions[invasionName][planetName] = {
                "completion"        : 0,
                "expanded"          : false,
                "attackingFaction"  : "",
                "defendingFaction"  : "",
                "attackerKey"       : "",
                "defenderKey"       : "",
                "nodes"             : []
              }
            }
            formattedInvasions[invasionName][planetName].attackingFaction = element.attackingFaction
            formattedInvasions[invasionName][planetName].defendingFaction = element.defendingFaction
            formattedInvasions[invasionName][planetName].attackerKey = element.attacker.factionKey
            formattedInvasions[invasionName][planetName].defenderKey = element.defender.factionKey
            formattedInvasions[invasionName][planetName].nodes.push(element)
          }
        });
        let percentage = 0
        for (let invasionName in formattedInvasions) {
          for (let planet in formattedInvasions[invasionName]) {
            percentage = 0
            for (let node of formattedInvasions[invasionName][planet].nodes) {
              percentage += node.completion
            }
            formattedInvasions[invasionName][planet].completion = percentage / formattedInvasions[invasionName][planet].nodes.length
          }
        }
        return formattedInvasions
      },
      getFactionColor: function(faction) {
        switch (faction) {
          case 'Grineer':
            return 'grineer';
          case 'Corpus':
            return 'corpus';
          case 'Infested':
            return 'infested';
          default:
            return 'grey-8'
        }
      },
      toggleSortieSlide: function(active) {
        this.pausedSortieSlide = active && !this.pausedSortieSlide
      },
      getData: function(_this) {
        axios
          .get("https://api.warframestat.us/pc?language=en")
          .then(response => {
            if (response.status === 200) {
              _this.$store.commit('liveDataStore/updatePcData', response.data)
            }
          })
        axios
          .get("https://api.warframestat.us/ps4?language=en")
          .then(response => {
            if (response.status === 200) {
              _this.$store.commit('liveDataStore/updatePsData', response.data)
            }
          })
        axios
          .get("https://api.warframestat.us/xb1?language=en")
          .then(response => {
            if (response.status === 200) {
              _this.$store.commit('liveDataStore/updateXbData', response.data)
            }
          })
        axios
          .get("https://api.warframestat.us/swi?language=en")
          .then(response => {
            if (response.status === 200) {
              _this.$store.commit('liveDataStore/updateNiData', response.data)
            }
          })
      }
    },
    created () {
       setInterval(this.getData(this), 15000)
    }
  }
</script>
