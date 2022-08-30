const { setTimeout } = require("timers/promises")

const { ServiceBroker: ServiceBroker19 } = require("moleculer19")
const { ServiceBroker: ServiceBroker20 } = require("moleculer20")

const brokerConfig = {
  logger: false,
  transporter: "Redis",
}

function createServices() {
  const broker1Services = []
  for (let i = 0; i < 1000; i++) {
    broker1Services.push({
      name: `broker1-service${i}`,
    })
  }

  const broker2Services = []
  for (let i = 0; i < 1000; i++) {
    broker2Services.push({
      name: `broker2-service${i}`,
    })
  }

  return {
    broker1Services,
    broker2Services,
  }
}

async function benchmark19() {
  const { broker1Services, broker2Services } = createServices()

  const broker19_1 = new ServiceBroker19({
    nodeID: "node-1",
    ...brokerConfig,
  })
  
  const broker19_2 = new ServiceBroker19({
    nodeID: "node-2",
    ...brokerConfig,
  })

  for (const service of broker1Services) {
    broker19_1.createService(service)
  }
  for (const service of broker2Services) {
    broker19_2.createService(service)
  }

  console.time("v0.14.19 startup time")
  await Promise.all([broker19_1.start(), broker19_2.start()])
  console.timeLog("v0.14.19 startup time")
  await Promise.all([broker19_1.stop(), broker19_2.stop()])

}

async function benchmark20() {
  const { broker1Services, broker2Services } = createServices()

  const broker20_1 = new ServiceBroker20({
    nodeID: "node-1",
    ...brokerConfig,
  })
  
  const broker20_2 = new ServiceBroker20({
    nodeID: "node-2",
    ...brokerConfig,
  })

  for (const service of broker1Services) {
    broker20_1.createService(service)
  }
  for (const service of broker2Services) {
    broker20_2.createService(service)
  }
  
  console.time("v0.14.20 startup time")
  await Promise.all([broker20_1.start(), broker20_2.start()])
  console.timeLog("v0.14.20 startup time")
  await Promise.all([broker20_1.stop(), broker20_2.stop()])
}

async function main() {
  await benchmark19()

  console.log("Waiting 5 seconds to get cleaner results")
  await setTimeout(5_000)

  await benchmark20()

  // v0.14.19 startup time: 628.894ms
  // v0.14.20 startup time: 3.514s
}

main()
