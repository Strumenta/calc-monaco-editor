package com.strumenta.simpleserver

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.http.content.files
import io.ktor.http.content.static
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import java.io.File

fun main(args: Array<String>) {
    val port = if (args.isEmpty()) 8080 else args[0].toInt()
    val server = embeddedServer(Netty, port = port) {
        routing {
            static("css") {
                files("../src/main/css")
            }
            static("js") {
                files("../dist")
            }
            static("node_modules") {
                files("../node_modules")
            }
            static("audio") {
                files("../audio")
            }
            get("/") {
                try {
                    val text = File("../src/main/html/index.html").readText(Charsets.UTF_8)
                    call.respondText(text, ContentType.Text.Html)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
    server.start(wait = false)
}