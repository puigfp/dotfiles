#!/usr/bin/swift
import Network
import Foundation
import CoreWLAN

let semaphore = DispatchSemaphore(value: 0)
let monitor = NWPathMonitor()

monitor.pathUpdateHandler = { path in
    print(path.isConstrained ? "true" : "false")
    semaphore.signal()
}

monitor.start(queue: DispatchQueue.global())
_ = semaphore.wait(timeout: .now() + 2)
monitor.cancel()

