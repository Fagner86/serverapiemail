# Reservation Confirmation Email Service

A small Express service that sends reservation confirmation emails (with a `.ics` calendar attachment) via [SendGrid](https://sendgrid.com/). It's the email backend for [AmbiTech](https://github.com/Fagner86/AmbiTech), the DI-UERN room/lab/equipment booking system.

## Endpoint

`POST /send-email` accepts either a single reservation or a batch of accepted/rejected requests (`solicitacaoAceitas` / `solicitacaoNaoAceitas`), builds a `.ics` calendar event for each accepted period, and emails it to the requester as a confirmation.

## Running locally

```bash
npm install
cp .env.example .env   # add your SendGrid API key
npm start
```

The server listens on `PORT` (default `4000`).

## Known limitations

This is a coursework project, not a production service: `/send-email` has no authentication, so anyone who can reach it can trigger an email (through the linked SendGrid account) to an arbitrary address. Don't expose this publicly without adding auth and rate limiting first.
