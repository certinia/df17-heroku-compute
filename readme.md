ffdc-df17-heroku-compute [![Build Status](https://travis-ci.org/financialforcedev/df17-heroku-compute.svg?branch=master)](https://travis-ci.org/financialforcedev/df17-heroku-compute)
===

This repo accompanies the Dreamforce '17 session **[Beat Governor Limits By Taking Your Compute Processes to Heroku](https://success.salesforce.com/Sessions#/session/a2q3A000001yuLtQAI)**.

It is optimized for development in VisualStudio Code.

Getting Started
---
See the [wiki](https://github.com/financialforcedev/df17-heroku-compute/wiki/Getting-Started) for local development and deployment instructions.

Architecture
---
![Architecture](docs/readme/df17-heroku-compute-architecture.gif)

Repository Structure
---
* This repository has 2 distinct components
    * [force](/force): The Force.com component of the application
    * [heroku](/heroku): The Heroku component of the application
* This simplification allows developers to see and use the entire application in one place. However, for Production we would recommend you instead use small, single-purpose repositories.