#!/usr/bin/env pwsh
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
npm run dev
