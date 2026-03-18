<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Quittance de Loyer</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .numero {
            font-size: 16px;
            color: #7f8c8d;
        }
        .section {
            margin-bottom: 30px;
        }
        .grid {
            width: 100%;
            border-collapse: collapse;
        }
        .col {
            width: 50%;
            vertical-align: top;
        }
        .label {
            font-weight: bold;
            color: #2c3e50;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
        }
        .value {
            font-size: 16px;
            color: #34495e;
        }
        .details-table {
            width: 100%;
            margin-top: 20px;
            border: 1px solid #ecf0f1;
        }
        .details-table th {
            background-color: #f9fbfe;
            color: #2c3e50;
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        .details-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        .total-box {
            background-color: #3498db;
            color: white;
            padding: 20px;
            text-align: right;
            margin-top: 30px;
            border-radius: 4px;
        }
        .total-amount {
            font-size: 24px;
            font-weight: bold;
        }
        .footer {
            margin-top: 60px;
        }
        .signature-space {
            margin-top: 40px;
            height: 100px;
            border-bottom: 1px dashed #bdc3c7;
            width: 250px;
        }
        .signature-label {
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 10px;
        }
        .company-info {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 100px;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Quittance de Loyer</div>
        <div class="numero">N° {{ $quittance->numero_quittance }}</div>
    </div>

    <div class="section">
        <table class="grid">
            <tr>
                <td class="col">
                    <span class="label">PROPRIÉTAIRE / BAILLEUR</span>
                    <div class="value">
                        <strong>{{ $loyer->tenant->nom }}</strong><br>
                        {{ $loyer->contrat->bien->proprietaire->nom }}<br>
                        {{ $loyer->contrat->bien->proprietaire->telephone }}
                    </div>
                </td>
                <td class="col" style="padding-left: 20px;">
                    <span class="label">LOCATAIRE</span>
                    <div class="value">
                        <strong>{{ $loyer->contrat->locataire->nom }}</strong><br>
                        {{ $loyer->contrat->locataire->telephone }}<br>
                        {{ $loyer->contrat->locataire->email }}
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div class="section">
        <span class="label">OBJET DE LA QUITTANCE</span>
        <div class="value">
            Paiement du loyer pour le bien situé à : <br>
            <strong>{{ $loyer->contrat->bien->adresse }} ({{ $loyer->contrat->bien->type }})</strong>
        </div>
    </div>

    <table class="details-table">
        <thead>
            <tr>
                <th>Période</th>
                <th>Description</th>
                <th style="text-align: right;">Montant</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ \Carbon\Carbon::parse($loyer->mois)->translatedFormat('F Y') }}</td>
                <td>Loyer et charges</td>
                <td style="text-align: right;">{{ number_format($loyer->montant, 0, ',', ' ') }} FCFA</td>
            </tr>
        </tbody>
    </table>

    <div class="total-box">
        <div>TOTAL PAYÉ</div>
        <div class="total-amount">{{ number_format($loyer->montant, 0, ',', ' ') }} FCFA</div>
    </div>

    <div class="section footer">
        <table class="grid">
            <tr>
                <td class="col">
                    <div class="value">
                        Fait le {{ $loyer->date_paiement ? $loyer->date_paiement->format('d/m/Y') : date('d/m/Y') }}<br>
                        Mode de paiement : {{ ucfirst($loyer->mode_paiement) }}
                    </div>
                </td>
                <td class="col" style="text-align: right;">
                    <div class="signature-label">Signature du bailleur</div>
                    <div class="signature-space" style="margin-left: auto;"></div>
                </td>
            </tr>
        </table>
    </div>

    <div class="company-info">
        Document généré par {{ $loyer->tenant->nom }} - Solution de gestion immobilière MaggyFast
    </div>
</body>
</html>
