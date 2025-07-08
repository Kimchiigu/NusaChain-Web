'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Chrome,
  Loader2
} from 'lucide-react';
import { getTrustScore } from '@/lib/firebase-utils';
import { TrustScore, ExtensionAlert } from '@/types/security';

export default function ExtensionSimulator() {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [alert, setAlert] = useState<ExtensionAlert | null>(null);
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);

  const simulateExtensionCheck = async () => {
    if (!url) return;

    setIsChecking(true);
    setAlert(null);
    setTrustScore(null);

    try {
      // Get trust score from Firebase
      const score = await getTrustScore(url);
      setTrustScore(score);

      // Generate alert based on trust score
      if (score) {
        if (score.score < 30) {
          setAlert({
            type: 'DANGER',
            title: '⚠️ DANGEROUS SITE DETECTED!',
            message: `Our security auditors have previously identified this site as potentially malicious. Trust Score: ${score.score}/100`,
            url,
            trustScore: score.score
          });
        } else if (score.score < 60) {
          setAlert({
            type: 'WARNING',
            title: '⚠️ Caution Required',
            message: `This site has a low trust score based on previous audits. Proceed with caution. Trust Score: ${score.score}/100`,
            url,
            trustScore: score.score
          });
        } else {
          setAlert({
            type: 'INFO',
            title: '✅ Site Appears Safe',
            message: `This site has been audited and appears to be legitimate. Trust Score: ${score.score}/100`,
            url,
            trustScore: score.score
          });
        }
      } else {
        setAlert({
          type: 'INFO',
          title: 'Unknown Site',
          message: 'This site is not in our database. If you find it suspicious, please submit it for analysis.',
          url
        });
      }
    } catch (error) {
      console.error('Error checking trust score:', error);
      setAlert({
        type: 'WARNING',
        title: 'Unable to Check Site',
        message: 'Could not verify site safety. Please proceed with caution.',
        url
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (url) {
      const timeoutId = setTimeout(() => {
        simulateExtensionCheck();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [url]);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'DANGER':
        return 'border-red-500 bg-red-50 text-red-900';
      case 'WARNING':
        return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      case 'INFO':
        return 'border-blue-500 bg-blue-50 text-blue-900';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-900';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'DANGER':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'INFO':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Extension Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Chrome className="w-5 h-5 text-blue-600" />
            <span>Fraud Prevention Extension</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            This simulates how the NusaChain browser extension would work in real-time, 
            checking trust scores as you browse Web3 sites.
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter a URL to check (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={simulateExtensionCheck}
              disabled={isChecking || !url}
              variant="outline"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extension Alert Simulation */}
      {alert && (
        <Card className={`border-2 ${getAlertStyle(alert.type)}`}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
                <p className="mb-4">{alert.message}</p>
                
                {alert.trustScore !== undefined && (
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Trust Score: </span>
                      <Badge variant={alert.trustScore < 30 ? 'destructive' : alert.trustScore < 60 ? 'secondary' : 'default'}>
                        {alert.trustScore}/100
                      </Badge>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          alert.trustScore < 30 ? 'bg-red-500' : 
                          alert.trustScore < 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${alert.trustScore}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  {alert.type === 'DANGER' && (
                    <Button variant="destructive" size="sm">
                      Block Site
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Report Issue
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trust Score Details */}
      {trustScore && (
        <Card>
          <CardHeader>
            <CardTitle>Trust Score Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Score</div>
                <div className="text-2xl font-bold text-gray-900">{trustScore.score}/100</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Reports</div>
                <div className="text-2xl font-bold text-gray-900">{trustScore.reportCount}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Last Updated</div>
                <div className="text-sm text-gray-900">
                  {trustScore.lastUpdated?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Extension Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Real-time Monitoring</h4>
                <p className="text-sm text-gray-600">
                  Automatically checks every Web3 site you visit against our trust database
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Transaction Interception</h4>
                <p className="text-sm text-gray-600">
                  Safely intercepts wallet transactions before they&apos;re sent to analyze potential threats
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">Human-Readable Warnings</h4>
                <p className="text-sm text-gray-600">
                  Translates complex blockchain transactions into simple, understandable warnings
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}