<script setup lang="ts">
import type { MaintenanceWidgetProps } from "./lib";
import { ref, watch, onMounted, defineProps, computed } from "vue";
import DeadImg from "./assets/dead.png";
import AsleepImg from "./assets/asleep.png";

// Props for overlay control and node URL
const props = defineProps<MaintenanceWidgetProps>();

// Local storage keys
const ASLEEP_KEY = "maintenance_asleep_overlay";
const HEAVY_KEY = "maintenance_heavy_overlay";
const TTL = 5 * 60 * 1000; // 5 minutes

function getStickyState(key: string, fallback: boolean) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
        const { value, ts } = JSON.parse(raw);
        if (Date.now() - ts < TTL) return value;
        localStorage.removeItem(key);
        return fallback;
    } catch {
        return fallback;
    }
}
function setStickyState(key: string, value: boolean) {
    localStorage.setItem(key, JSON.stringify({ value, ts: Date.now() }));
}

const showAsleep = ref(getStickyState(ASLEEP_KEY, !!props.showAsleep));
const showHeavyLoad = ref(getStickyState(HEAVY_KEY, !!props.showHeavyLoad));

const actualNodeUrl = computed(() => {
    return props.nodeurl || (window.location.hostname === "localhost" ? undefined : "https://node.testnet.hyli.org");
});

watch(
    () => props.showAsleep,
    (val) => {
        showAsleep.value = !!val;
        setStickyState(ASLEEP_KEY, !!val);
    }
);
watch(
    () => props.showHeavyLoad,
    (val) => {
        showHeavyLoad.value = !!val;
        setStickyState(HEAVY_KEY, !!val);
    }
);

// Keep overlays sticky for 5 minutes
watch(showAsleep, (val) => setStickyState(ASLEEP_KEY, val));
watch(showHeavyLoad, (val) => setStickyState(HEAVY_KEY, val));

// Fetch /v1/info at mount to check if we should display the asleep overlay
onMounted(() => {
    if (actualNodeUrl.value && !showAsleep.value) {
        const fetchInfo = async () => {
            try {
                await fetch(`${actualNodeUrl.value}/v1/info`, { cache: "no-store" });
            } catch {
                // If the fetch fails, assume the node is asleep
                showAsleep.value = true;
                setStickyState(ASLEEP_KEY, true);
            }
        };
        fetchInfo();
    }
});
</script>

<template>
    <!-- Testnet off for the night -->
    <div v-if="showAsleep" class="maintenance-overlay">
        <div class="maintenance-modal">
            <div class="maintenance-img">
                <img :src="AsleepImg" alt="Hyli asleep" />
            </div>
            <h2>Hyli is asleep for the night.</h2>
            <p>The testnet is off while we make some upgrades.</p>
            <p>
                For updates, follow us on
                <a href="https://x.com/hyli_org" target="_blank">X</a>
                and
                <a href="https://t.me/+ziFJlAUfPlU1NzRk" target="_blank">Telegram</a>.
            </p>
        </div>
    </div>

    <!-- Testnet under heavy load -->
    <div v-if="showHeavyLoad" class="maintenance-overlay">
        <div class="maintenance-modal">
            <div class="maintenance-img">
                <img :src="DeadImg" alt="Hyli under load" />
            </div>
            <h2>The testnet is under heavy load !</h2>
            <p>Come back in a few minutes.</p>
            <p>
                In the meantime, why not check out<br />
                our memes on
                <a href="https://x.com/hyli_org" target="_blank">X</a>
                and
                <a href="https://t.me/+ziFJlAUfPlU1NzRk" target="_blank">Telegram</a>.
            </p>
        </div>
    </div>
</template>

<style>
:host {
    --color-primary: #ff6b6b;
    --color-secondary: #ff9660;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    line-height: 1.5;
}
.maintenance-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    pointer-events: auto;
    cursor: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}
.maintenance-modal {
    background: rgba(0, 0, 0, 1);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    color: var(--color-primary);
    max-width: 80vw;
    min-width: 300px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    z-index: 10001;
}
.maintenance-modal h2 {
    color: var(--color-secondary);
    margin-bottom: 10px;
}
.maintenance-modal p {
    color: #ccc;
    margin-top: 10px;
}
.maintenance-img {
    display: flex;
    justify-content: center;
}
.maintenance-img img {
    border-radius: 20px;
    margin-bottom: 20px;
    width: 300px;
    max-width: 100%;
    max-height: 300px;
}
.maintenance-modal a {
    color: var(--color-secondary);
}
</style>
