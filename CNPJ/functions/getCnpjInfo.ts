import { z } from 'zod'
import axios from 'axios'

export const zodBrasilApiCnpjInfo = z.object({
  cnpj: z.string(),
  identificador_matriz_filial: z.number(),
  descricao_matriz_filial: z.string().optional(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
  situacao_cadastral: z.number(),
  descricao_situacao_cadastral: z.string().optional(),
  data_situacao_cadastral: z.string().nullable(),
  motivo_situacao_cadastral: z.number(),
  nome_cidade_exterior: z.string().nullable().optional(),
  codigo_natureza_juridica: z.number(),
  data_inicio_atividade: z.string(),
  cnae_fiscal: z.number(),
  cnae_fiscal_descricao: z.string(),
  descricao_tipo_logradouro: z.string().optional(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  cep: z.string(),
  uf: z.string(),
  codigo_municipio: z.number(),
  municipio: z.string(),
  ddd_telefone_1: z.string(),
  ddd_telefone_2: z.string().nullable(),
  ddd_fax: z.string().nullable(),
  qualificacao_do_responsavel: z.number(),
  capital_social: z.number(),
  porte: z.string(),
  descricao_porte: z.string(),
  opcao_pelo_simples: z.boolean().nullable(),
  data_opcao_pelo_simples: z.string().nullable(),
  data_exclusao_do_simples: z.string().nullable(),
  opcao_pelo_mei: z.boolean().nullable(),
  situacao_especial: z.string().nullable(),
  data_situacao_especial: z.string().nullable(),
  cnaes_secundarios: z.array(
    z.object({ codigo: z.number(), descricao: z.string() })
  ),
  qsa: z.array(
    z.object({
      identificador_de_socio: z.number(),
      nome_socio: z.string(),
      cnpj_cpf_do_socio: z.string(),
      codigo_qualificacao_socio: z.number(),
      percentual_capital_social: z.number().optional(),
      data_entrada_sociedade: z.string(),
      cpf_representante_legal: z.string().nullable(),
      nome_representante_legal: z.string().nullable(),
      codigo_qualificacao_representante_legal: z.number().nullable()
    })
  )
})
export type BrasilApiCnpjInfo = z.infer<typeof zodBrasilApiCnpjInfo>

export async function getCnpjInfo (props: {
  cnpj: string
}): Promise<{
    success: true
    cnpjInfo: BrasilApiCnpjInfo
  } | {
    success: false
    err: string
  }> {
  try {
    const axiosResponse = await axios({
      method: 'GET',
      url: `https://brasilapi.com.br/api/cnpj/v1/${props.cnpj}`
    }).catch(err => {
      throw err
    })
    const cnpjInfo = zodBrasilApiCnpjInfo.safeParse(axiosResponse.data)
    if (!cnpjInfo.success) {
      return {
        success: false,
        err: `Erro ao buscar informações do CNPJ ${props.cnpj}: ${JSON.stringify(cnpjInfo.error.issues, null, 2)}`
      }
    }
    return {
      success: true,
      cnpjInfo: cnpjInfo.data
    }
  } catch (err) {
    return {
      success: false,
      err: `Erro ao buscar informações do CNPJ ${props.cnpj}: ${String(err)}`
    }
  }
}
