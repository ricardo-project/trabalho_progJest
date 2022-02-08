import funcao from "../../../funcoes";
import { app, setup } from "../../index";
import { afterAll, describe, expect, test, beforeAll } from "@jest/globals";
import supertest, { agent } from "supertest";
import { getConnection } from "typeorm";
import { isJSDocDeprecatedTag } from "typescript";

// BANCO ORIGINAL: postgres

const criarCep = funcao.criarCep
const criarCompl = funcao.criarCompl
const players = [
    { nickname: "foxylady", senha: "banana", pontos: 100, endereco_id: 2 },
    { nickname: "rixarlisson", senha: "bolinho21", pontos: 200, endereco_id: 5 },
    { nickname: "t@xm@n_666", senha: "maçã", pontos: 100, endereco_id: 9 }
]; const objetivo = [
    { id: 0, descricao: "Atacar os inimigos", pontos: 50 },
    { id: 1, descricao: "Invadir a base militar", pontos: 200 },
    { id: 2, descricao: "Pegar as armas dos inimigos", pontos: 100 }
]; const partidas = [
    { id: 0, inicio: "2022-01-01", fim: "2022-01-01", jogador_nickname: "foxylady" },
    { id: 1, inicio: "2022-01-02", fim: "2022-01-02", jogador_nickname: "rixarlisson"},
    { id: 2, inicio: "2021-12-01", fim: "2021-12-02", jogador_nickname: "t@xm@n_666"}
]; const rounds = [
    { id: 0, numero: 2, inicio: "2022-01-01", fim: "2022-01-01", modo: "TERRORISTA", partida_id: 0 },
    { id: 2, numero: 5, inicio: "2022-01-02", fim: "2022-01-02", modo: "CONTRATERRORISTA", partida_id: 1 },
    { id: 3, numero: 7, inicio: "2021-12-01", fim: "2021-12-01", modo: "TERRORISTA", partida_id: 2 }
]

describe("Testes de persistência", () =>{
    beforeAll(async () => {
        await setup()
    });
    afterAll(async () => {
        await getConnection().close()
        console.log("Conexão finalizada!")
    });

    it('Mostrar todas as tabelas', async() => {
        var agent = supertest(app)
        const r = await agent.post('/round/list')
        console.log("Rounds:\n", r.body)
        const p = await agent.post('/partida/list')
        console.log("Partidas:\n", p.body)
        const j = await agent.post('/jogador/list')
        console.log("Jogadores:\n", j.body)
        const e = await agent.post('/endereco/list')
        console.log("Endereços:\n", e.body)
        const o = await agent.post('/objetivo/list')
        console.log("Objetivos:\n", o.body)
    })

    it('Adicionar itens', async() => {
        var agent = supertest(app)
        for(let i = 1; i <= 10; i++) {
            await agent.post('/endereco/store').send({
                id: i,
                "cep": criarCep(),
                "complemento": criarCompl()
            })
        } for(let p of players) {
            await agent.post('/jogador/store').send(p)
        } for(let o of objetivo) {
            await agent.post('/objetivo/store').send(o)
        }
    })

    it('Adicionar ou remover partidas e rounds (mostrar se houver)', async() => {
        var agent = supertest(app)
        var removePLast = false
        console.log(" ===== PARTIDAS ===== ")
        const allP = await agent.post('/partida/list')
        const allR = await agent.post('/round/list')
        const listP = allP.body
        const listR = allR.body
        if(listP.length == 0 && listR.length == 0) {
            console.log("Nenhuma partida e round encontrados!!! " + partidas.length + " partidas e " + rounds.length + " rounds serão adicionados AGORA!")
            for(let P of partidas) {
                await agent.post('/partida/store').send(P)
            } for(let R of rounds) {
                await agent.post('/round/store').send(R)
            }
        } else {
            if(listP.length == 1) {
                console.log("Uma partida encontrada:\n", listP[0])
            } else {
                console.log(listP.length + " partidas encontradas:\n", listP)
            } if(listR.length == 1) {
                console.log("Um round encontrado:\n", listR[0])
            } else {
                console.log(listR.length + " rounds encontrados:\n", listR)
            } console.log(" !--- Deletar rounds ---!")
            for(let r of listR) {
                await agent.post('/round/delete').send({ "id": r.id })
            } console.log(" !--- Deletar partidas ---! ")
            for(let p of listP) {
                await agent.post('/partida/delete').send({ "id": p.id })
            }
        }
    })
});